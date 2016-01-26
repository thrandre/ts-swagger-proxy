/// <reference path="./typings/typings.d.ts" />

import * as Request from "superagent";
import * as FS from "fs";
import * as Path from "path";

import { ApiFactoryTypeInfo, ApiTypeInfo, ConfigureRequestTypeInfo, HttpOptionsTypeInfo, HttpRequestTypeInfo, HttpResponseTypeInfo } from "./Builtins";
import { groupBy, mapMany, unique, resolveJsonRef } from "./Utils";
import { IEndpointGroup, IEndpoint, IModel, IMethod, IParameter, ITypeInfo } from "./Metadata";
import { default as Emitter, expandTypeInfo, newline, tab } from "./Emitter";
import SwaggerParser from "./Swagger";

interface IManifest {
    url: string;
    out: string;
}

function removeDirectory(path: string) {
    if (FS.existsSync(path)) {
        FS.readdirSync(path).forEach((file, index) => {
            var curPath = path + "/" + file;
            if (FS.lstatSync(curPath).isDirectory()) { // recurse
                removeDirectory(curPath);
            } else { // delete file
                FS.unlinkSync(curPath);
            }
        });
        FS.rmdirSync(path);
    }
};

function ensureDirectoryExists(path: string, cb: (err: Error) => void) {
    FS.mkdir(path, (err) => {
        if (!err) {
            return cb(err);
        }

        if (err) {
            return err.code == "EEXIST" ?
                cb(null) :
                cb(err);
        }

        return cb(null);
    });
}

const manifestPath = Path.resolve(process.cwd(), "ts-swagger-proxy.json");
const manifest: IManifest = JSON.parse(FS.readFileSync(manifestPath, "utf-8"));
const outDir = Path.resolve(Path.dirname(manifestPath), manifest.out);

const modelDir = Path.resolve(outDir, "./models");
const proxyDir = Path.resolve(outDir, "./proxies");

console.log(outDir);

removeDirectory(outDir);
ensureDirectoryExists(outDir, console.log);
ensureDirectoryExists(modelDir, console.log);
ensureDirectoryExists(proxyDir, console.log);

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

function resolveDependencies(types: ITypeInfo[], resolve: (type: ITypeInfo) => string) {
    return groupBy(unique(types.filter(t => t.isCustomType), t => t.type), t => resolve(t));
}

function resolveModule(type: ITypeInfo): string {
    if (type.isProxyUtil) {
        return `./proxyUtils.ts`;
    }

    return `./models/${type.type}`;
}

Request.get("http://localhost:55037/swagger/docs/v1", (err, res) => {
    if (err) {
        console.error(err);
    }

    const result = parser.parse(res.body);
    const modules = result.models;

    const endpointGroups = groupEndpoints(result.endpoints);

    const bsEnd = endpointGroups[3];
    const bsMeths = mapMany(bsEnd.endpoints, e => e.methods);
    const bsParams = mapMany(bsMeths, m => m.parameters).map(p => p.type);
    const bsRets = mapMany(bsMeths, r => r.responses).map(r => r.type);
    const bsDeps = resolveDependencies(
        bsParams
            .concat(bsRets)
            .concat([
                ApiTypeInfo,
                ApiFactoryTypeInfo,
                HttpRequestTypeInfo,
                HttpResponseTypeInfo,
                HttpOptionsTypeInfo,
                ConfigureRequestTypeInfo
            ]),
        resolveModule
    );

    const bs = Emitter.$module([
        Emitter.$block(
            Object.keys(bsDeps).map(k => Emitter.$import(bsDeps[k].map(d => d.type), k))
        ),
        Emitter.$proxy(bsEnd)
    ])();

    modules.forEach(m => {
        const deps = resolveDependencies(m.properties.map(p => p.type), resolveModule);
        emitter.emit(
            m.name,
            Emitter.$module([
                Emitter.$block(
                    Object.keys(deps).map(k => Emitter.$import(deps[k].map(d => d.type), k))
                ),
                Emitter.$model(m)
            ])()
        );
    });
});

interface HttpRequest {
    query(q: any);
    send(d: any);
}

interface ConfigureRequest {
    (request: HttpRequest): void;
}

interface ApiFactory {
    (name: string): Api;
}

interface HttpOptions {
    url: string;
    actionKey: string;
    emitPending?: boolean;
    keepActiveRequests?: boolean;
}

interface HttpResponse<T> {
    body: T;
}

declare interface Api {
    get<T>(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<T>>;
    get(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;
    post(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;
    put(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;
    del(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;
}