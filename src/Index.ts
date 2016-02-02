/// <reference path="./typings/typings.d.ts" />

import * as Request from "superagent";
import * as FS from "fs";
import * as Path from "path";

import { 
    ApiFactoryTypeInfo, 
    ApiTypeInfo, 
    ConfigureRequestTypeInfo, 
    HttpOptionsTypeInfo, 
    HttpRequestTypeInfo, 
    HttpResponseTypeInfo,
    ProxyUtils
} from "./Builtins";

import { groupBy, mapMany, unique, resolveJsonRef } from "./Utils";
import { IEndpointGroup, IEndpoint, IModel, IMethod, IParameter, ITypeInfo, createTypeInfo } from "./Metadata";
import { default as Emitter, expandTypeInfo, newline, tab } from "./Emitter";

import { ensureDirectoriesExists, removeDirectory } from "./FsUtils";

import SwaggerParser from "./Swagger";

interface IManifest {
    url: string;
    out: string;
    flush: boolean;
}

class ModuleEmitter {

    constructor(private writeFile: (name: string, data: string) => void) { }

    emit(name: string, data: string) {
        this.writeFile(name, data + newline());
    }

}

function groupEndpoints(endpoints: IEndpoint[]): IEndpointGroup[] {
    const groups = groupBy(endpoints, e => e.group);
    return Object.keys(groups).map(k => ({
        name: k,
        endpoints: groups[k]
    }));
}

const parser = new SwaggerParser();
const emitter = new ModuleEmitter((name, data) => {

    const path = "./modules/" + name + ".ts";
    FS.writeFile(path, data);

});

const getModelDirectory = (basepath: string) => Path.resolve(basepath, "./models");
const getProxyDirectory = (basepath: string) => Path.resolve(basepath, "./proxies");

function init(workingDirectory: string) {
    const manifestPath = Path.resolve(workingDirectory, "ts-swagger-proxy.json");
    const manifest: IManifest = JSON.parse(FS.readFileSync(manifestPath, "utf-8"));

    const outDir = Path.resolve(Path.dirname(manifestPath), manifest.out);
    
    if(manifest.flush) {
       removeDirectory(outDir); 
    }
    
    ensureDirectoriesExists(outDir, getModelDirectory(outDir), getProxyDirectory(outDir));
    generateProxy(manifest.url, outDir);
}

interface IModule {
    name: string;
    path: string;
    exports: ITypeInfo[];
    imports: ITypeInfo[];
}

function resolveModuleDependencies(mod: IModule, resolve: (type: ITypeInfo) => IModule) {
    const deps = groupBy(mod.imports, i => resolve(i).path);
    return Object
        .keys(deps)
        .reduce((prev, next) => {
            const relativePath = (
                (Path.relative(Path.dirname(mod.path), Path.dirname(next)) || ".") + Path.sep +
                Path.basename(next, ".ts")
            )
            .replace(/\\/g, "/");
            
            prev[relativePath] = deps[next].map(d => d.type)
            return prev;
        }, {});
}

function generateProxy(url: string, outDir: string) {
    Request.get(url, (err, res) => {
        if (err) {
            console.error(err);
        }

        const result = parser.parse(res.body);
        const models = result.models;
        const endpointGroups = groupEndpoints(result.endpoints);
        
        const modules = models
            .map<IModule>(m => ({
                name: m.name,
                path: Path.resolve(getModelDirectory(outDir), `${ m.name }.ts`),
                exports: [ { type: m.name, isArray: false, isCustomType: false, isProxyUtil: false } ],
                imports: unique(m.properties.map(p => p.type).filter(t => t.isCustomType), t => t.type)
            }))
            .concat(
                endpointGroups.map<IModule>(g => ({
                    name: g.name,
                    path: Path.resolve(getProxyDirectory(outDir), `${ g.name }.ts`),
                    exports: [ { type: g.name, isArray: false, isCustomType: false, isProxyUtil: false } ],
                    imports: unique(
                        mapMany(
                            mapMany(g.endpoints, e => e.methods), 
                            m => m.parameters
                                .map(p => p.type)
                                .concat(m.responses
                                    .map(r => r.type)))
                            .filter(t => t.isCustomType),
                        t => t.type
                    ).concat([
                        ApiFactoryTypeInfo,
                        ApiTypeInfo,
                        ConfigureRequestTypeInfo,
                        HttpOptionsTypeInfo,
                        HttpRequestTypeInfo, 
                        HttpResponseTypeInfo
                    ])
                }))
            )
            .concat([
               {
                   name: "ProxyUtils",
                   path: Path.resolve(outDir, `ProxyUtils.ts`),
                   exports: [
                        ApiFactoryTypeInfo,
                        ApiTypeInfo,
                        ConfigureRequestTypeInfo,
                        HttpOptionsTypeInfo,
                        HttpRequestTypeInfo, 
                        HttpResponseTypeInfo
                   ],
                   imports: []
               } 
            ]);
        
        modules.forEach(m => 
            resolveModuleDependencies(m, type => modules.find(m => m.exports.some(e => e.type === type.type)))
        );
        
        FS.writeFileSync("foo.json", JSON.stringify(modules));
    });
}

init(process.cwd());