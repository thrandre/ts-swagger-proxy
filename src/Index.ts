#!/usr/bin/env node

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
	AssertTypeInfo,
	CheckTypeInfo,
	IsNumberTypeInfo, 
	IsStringTypeInfo, 
	IsBooleanTypeInfo,
	IsArrayTypeInfo,
	HasShapeTypeInfo, 
    ProxyUtils
} from "./Builtins";

import { groupBy, mapMany, unique, resolveJsonRef, getModelName, getProxyName } from "./Utils";
import {
    IEndpointGroup,
    IEndpoint,
    IModel,
    IMethod,
    IParameter,
    ITypeInfo,
    IModule,
    IDependencyMap,
    ModuleKind,
    createTypeInfo
} from "./Metadata";

import { default as Emitter, expandTypeInfo, newline, tab } from "./Emitter";

import { ensureDirectoriesExists, removeDirectory } from "./FsUtils";

import SwaggerParser from "./Swagger";

interface IManifest {
    url: string;
    out: string;
    flush: boolean;
	preserveUtils: boolean;
}

class ModuleEmitter {

    constructor(private writeFile: (name: string, data: string) => void) { }

    emit(name: string, data: string) {
        this.writeFile(name, data + newline());
    }

}

const getModelDirectory = (basepath: string) => Path.resolve(basepath, "./models");
const getProxyDirectory = (basepath: string) => Path.resolve(basepath, "./proxies");

function groupEndpoints(endpoints: IEndpoint[]): IEndpointGroup[] {
    const groups = groupBy(endpoints, e => e.group);
    return Object.keys(groups).map(k => ({
        name: getProxyName(k),
        endpoints: groups[k]
    }));
}

function init(workingDirectory: string) {
    const manifestPath = Path.resolve(workingDirectory, "ts-swagger-proxy.json");
    let manifest: IManifest = null;
	
	try {
		manifest = JSON.parse(FS.readFileSync(manifestPath, "utf-8"));
	}
	catch(err) {
		console.error(`Unable to find local ts-swagger-proxy.json manifest in ${ workingDirectory }`);
		return;
	}

    const outDir = Path.resolve(Path.dirname(manifestPath), manifest.out);

    if (manifest.flush) {
		removeDirectory(getModelDirectory(outDir));
		removeDirectory(getProxyDirectory(outDir));
    }

    ensureDirectoriesExists(outDir, getModelDirectory(outDir), getProxyDirectory(outDir));
    generateProxy(manifest.url, outDir, manifest.preserveUtils);
}

function resolveModuleDependencies(mod: IModule, resolve: (type: ITypeInfo) => IModule): IDependencyMap {
    const deps = groupBy(mod.imports, i => resolve(i).path);
    return Object
        .keys(deps)
        .reduce<{ [key: string]: string[] }>((prev, next) => {
            const enforceStandingDir = (path: string) => !path.startsWith(".") ? 
				"." + Path.sep + path :
				path;
			
			const relativePath = enforceStandingDir(
				(Path.relative(Path.dirname(mod.path), Path.dirname(next)) || ".") + Path.sep +
				Path.basename(next, ".ts")
			)
			.replace(/\\/g, "/");

            prev[relativePath] = deps[next].map(d => d.type)

            return prev;
        }, {});
}

interface IModuleOutput {
    path: string;
    content: string;
}

interface IResolveModule {
    (type: ITypeInfo): IModule;
}

const getModuleResolver: (graph: IModule[]) => IResolveModule =
    (graph) =>
        (type) =>
            graph.find(m => m.exports.some(e => e.type === type.type));

const moduleEmitters: { [key: number]: (module: IModule, resolve: IResolveModule) => IModuleOutput } = {
    [ModuleKind.Model]: (model: IModule, resolve: IResolveModule) => {
        const deps = resolveModuleDependencies(model, resolve)
        return {
            path: model.path,
            content: Emitter.$module([
                Emitter.$block(
                    Object.keys(deps).map(d => Emitter.$import(deps[d], d))
                ),
                Emitter.$model(model.model)
            ])()
        };
    },
    [ModuleKind.Proxy]: (proxy: IModule, resolve: IResolveModule) => {
        const deps = resolveModuleDependencies(proxy, resolve)
        return {
            path: proxy.path,
            content: Emitter.$module([
                Emitter.$block(
                    Object.keys(deps).map(d => Emitter.$import(deps[d], d))
                ),
                Emitter.$proxy(proxy.endpointGroup, resolve)
            ])()
        };
    },
    [ModuleKind.Util]: (util: IModule, resolve: IResolveModule) => {
        return {
            path: util.path,
            content: ProxyUtils
        };
    },
    [ModuleKind.Index]: (index: IModule, resolve: IResolveModule) => {
        const deps = resolveModuleDependencies(index, resolve)
        return {
            path: index.path,
            content: Emitter.$module([
                Emitter.$block(
                    Object.keys(deps).map(d => Emitter.$reexport(deps[d], d))
                )
            ])()
        };
    },
    [ModuleKind.EndpointIndex]: (index: IModule, resolve: IResolveModule) => {
        const deps = resolveModuleDependencies(index, resolve)
        return {
            path: index.path,
            content: Emitter.$module([
                Emitter.$block(
                    Object.keys(deps).map(d => Emitter.$import(deps[d], d))
                ),
                Emitter.$endpointIndex(index.imports)
            ])()
        };
    }
};

function generateProxy(url: string, outDir: string, preserveUtils: boolean = false) {
    const parser = new SwaggerParser();

    Request.get(url, (err, res) => {
        if (err) {
            console.error(`Unable to contact Swagger on ${ url }. Error: `, err);
        	return;
		}

        const result = parser.parse(res.body);
        const models = result.models;
        const endpointGroups = groupEndpoints(result.endpoints);

        let moduleGraph = models
            .map<IModule>(m => ({
                name: m.name,
                path: Path.resolve(getModelDirectory(outDir), `${m.name}.ts`),
                kind: ModuleKind.Model,
                model: m,
                exports: [{ type: m.name, isArray: false, isCustomType: false }],
                imports: unique(m.properties.map(p => p.type).filter(t => t.isCustomType), t => t.type)
            }))
            .concat(
			endpointGroups.map<IModule>(g => ({
				name: g.name,
				path: Path.resolve(getProxyDirectory(outDir), `${g.name}.ts`),
				kind: ModuleKind.Proxy,
				endpointGroup: g,
				exports: [{ type: g.name, isArray: false, isCustomType: false }],
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
					HttpResponseTypeInfo,
					AssertTypeInfo,
					CheckTypeInfo,
					IsNumberTypeInfo, 
					IsStringTypeInfo, 
					IsBooleanTypeInfo,
					IsArrayTypeInfo,
					HasShapeTypeInfo
				])
			}))
            )
            .concat([
				{
					name: "ProxyUtils",
					path: Path.resolve(outDir, `ProxyUtils.ts`),
					kind: ModuleKind.Util,
					exports: [
                        ApiFactoryTypeInfo,
                        ApiTypeInfo,
                        ConfigureRequestTypeInfo,
                        HttpOptionsTypeInfo,
                        HttpRequestTypeInfo,
                        HttpResponseTypeInfo,
						AssertTypeInfo,
						CheckTypeInfo,
						IsNumberTypeInfo, 
						IsStringTypeInfo, 
						IsBooleanTypeInfo,
						IsArrayTypeInfo,
						HasShapeTypeInfo
					],
					imports: []
				}
            ]);

        moduleGraph = moduleGraph.concat([
            {
                name: "ModelIndex",
                path: Path.resolve(getModelDirectory(outDir), `index.ts`),
                kind: ModuleKind.Index,
                exports: [],
                imports: moduleGraph.filter(m => m.kind === ModuleKind.Model).map(m => createTypeInfo(m.name))
            }
        ]);

        moduleGraph = moduleGraph.concat([
            {
                name: "ProxyIndex",
                path: Path.resolve(getProxyDirectory(outDir), `index.ts`),
                kind: ModuleKind.Index,
                exports: [],
                imports: moduleGraph.filter(m => m.kind === ModuleKind.Proxy).map(m => createTypeInfo(m.name))
            }
        ]);

        moduleGraph = moduleGraph.concat([
            {
                name: "Index",
                path: Path.resolve(outDir, `index.ts`),
                kind: ModuleKind.EndpointIndex,
                exports: [],
                imports: moduleGraph
                    .filter(m => m.kind === ModuleKind.Proxy)
					.map(m => createTypeInfo(m.name))
                    .concat([ApiFactoryTypeInfo])
            }
        ]);

        const resolver = getModuleResolver(moduleGraph);
        const moduleOutputs = moduleGraph
			.filter(m => m.kind !== ModuleKind.Util || !preserveUtils)
			.map(m => moduleEmitters[m.kind](m, resolver));

        moduleOutputs.forEach(b => {
			FS.writeFileSync(b.path, b.content + newline());
        });
    });
}

init(process.cwd());
