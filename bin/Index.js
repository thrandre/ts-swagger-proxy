#!/usr/bin/env node
"use strict";

var _moduleEmitters;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _superagent = require("superagent");

var Request = _interopRequireWildcard(_superagent);

var _fs = require("fs");

var FS = _interopRequireWildcard(_fs);

var _path = require("path");

var Path = _interopRequireWildcard(_path);

var _Builtins = require("./Builtins");

var _Utils = require("./Utils");

var _Metadata = require("./Metadata");

var _Emitter = require("./Emitter");

var _Emitter2 = _interopRequireDefault(_Emitter);

var _FsUtils = require("./FsUtils");

var _Swagger = require("./Swagger");

var _Swagger2 = _interopRequireDefault(_Swagger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getModelDirectory = function getModelDirectory(basepath) {
    return Path.resolve(basepath, "./models");
};
var getProxyDirectory = function getProxyDirectory(basepath) {
    return Path.resolve(basepath, "./proxies");
};
function parseArgs(args) {
    return args.slice(2).reduce(function (prev, next) {
        var _next$split = next.split("=");

        var _next$split2 = (0, _slicedToArray3.default)(_next$split, 2);

        var key = _next$split2[0];
        var val = _next$split2[1];

        key = key.replace("--", "");
        if (key && !val) {
            prev[key] = true;
            return prev;
        }
        prev[key] = val;
        return prev;
    }, {});
}
function groupEndpoints(endpoints) {
    var groups = (0, _Utils.groupBy)(endpoints, function (e) {
        return e.group;
    });
    return (0, _keys2.default)(groups).map(function (k) {
        return {
            name: (0, _Utils.getProxyName)(k),
            endpoints: groups[k]
        };
    });
}
function init(workingDirectory, manifest) {
    var outDir = Path.resolve(workingDirectory, manifest.out);
    if (manifest.flush) {
        (0, _FsUtils.removeDirectory)(getModelDirectory(outDir));
        (0, _FsUtils.removeDirectory)(getProxyDirectory(outDir));
    }
    (0, _FsUtils.ensureDirectoriesExists)(outDir, getModelDirectory(outDir), getProxyDirectory(outDir));
    generateProxy(manifest.url, outDir, manifest.preserveUtils);
}
function resolveModuleDependencies(mod, resolve) {
    var deps = (0, _Utils.groupBy)(mod.imports, function (i) {
        return resolve(i).path;
    });
    return (0, _keys2.default)(deps).reduce(function (prev, next) {
        var enforceStandingDir = function enforceStandingDir(path) {
            return !path.startsWith(".") ? "." + Path.sep + path : path;
        };
        var relativePath = enforceStandingDir((Path.relative(Path.dirname(mod.path), Path.dirname(next)) || ".") + Path.sep + Path.basename(next, ".ts")).replace(/\\/g, "/");
        prev[relativePath] = deps[next].map(function (d) {
            return d.type;
        });
        return prev;
    }, {});
}
var getModuleResolver = function getModuleResolver(graph) {
    return function (type) {
        return graph.find(function (m) {
            return m.exports.some(function (e) {
                return e.type === type.type;
            });
        });
    };
};
var moduleEmitters = (_moduleEmitters = {}, (0, _defineProperty3.default)(_moduleEmitters, _Metadata.ModuleKind.Model, function (model, resolve) {
    var deps = resolveModuleDependencies(model, resolve);
    return {
        path: model.path,
        content: _Emitter2.default.$module([_Emitter2.default.$block((0, _keys2.default)(deps).map(function (d) {
            return _Emitter2.default.$import(deps[d], d);
        })), _Emitter2.default.$model(model.model)])()
    };
}), (0, _defineProperty3.default)(_moduleEmitters, _Metadata.ModuleKind.Proxy, function (proxy, resolve) {
    var deps = resolveModuleDependencies(proxy, resolve);
    return {
        path: proxy.path,
        content: _Emitter2.default.$module([_Emitter2.default.$block((0, _keys2.default)(deps).map(function (d) {
            return _Emitter2.default.$import(deps[d], d);
        })), _Emitter2.default.$proxy(proxy.endpointGroup, resolve)])()
    };
}), (0, _defineProperty3.default)(_moduleEmitters, _Metadata.ModuleKind.Util, function (util, resolve) {
    return {
        path: util.path,
        content: _Builtins.ProxyUtils
    };
}), (0, _defineProperty3.default)(_moduleEmitters, _Metadata.ModuleKind.Index, function (index, resolve) {
    var deps = resolveModuleDependencies(index, resolve);
    return {
        path: index.path,
        content: _Emitter2.default.$module([_Emitter2.default.$block((0, _keys2.default)(deps).map(function (d) {
            return _Emitter2.default.$reexport(deps[d], d);
        }))])()
    };
}), (0, _defineProperty3.default)(_moduleEmitters, _Metadata.ModuleKind.EndpointIndex, function (index, resolve) {
    var deps = resolveModuleDependencies(index, resolve);
    return {
        path: index.path,
        content: _Emitter2.default.$module([_Emitter2.default.$block((0, _keys2.default)(deps).map(function (d) {
            return _Emitter2.default.$import(deps[d], d);
        })), _Emitter2.default.$endpointIndex(index.imports)])()
    };
}), _moduleEmitters);
function generateProxy(url, outDir) {
    var preserveUtils = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    var parser = new _Swagger2.default();
    Request.get(url, function (err, res) {
        if (err) {
            console.error("Unable to contact Swagger on " + url + ". Error: ", err);
            return;
        }
        var result = parser.parse(res.body);
        var models = result.models;
        var endpointGroups = groupEndpoints(result.endpoints);
        var moduleGraph = models.map(function (m) {
            return {
                name: m.name,
                path: Path.resolve(getModelDirectory(outDir), m.name + ".ts"),
                kind: _Metadata.ModuleKind.Model,
                model: m,
                exports: [{ type: m.name, isArray: false, isCustomType: false }],
                imports: (0, _Utils.unique)(m.properties.map(function (p) {
                    return p.type;
                }).filter(function (t) {
                    return t.isCustomType;
                }), function (t) {
                    return t.type;
                })
            };
        }).concat(endpointGroups.map(function (g) {
            return {
                name: g.name,
                path: Path.resolve(getProxyDirectory(outDir), g.name + ".ts"),
                kind: _Metadata.ModuleKind.Proxy,
                endpointGroup: g,
                exports: [{ type: g.name, isArray: false, isCustomType: false }],
                imports: (0, _Utils.unique)((0, _Utils.mapMany)((0, _Utils.mapMany)(g.endpoints, function (e) {
                    return e.methods;
                }), function (m) {
                    return m.parameters.map(function (p) {
                        return p.type;
                    }).concat(m.responses.map(function (r) {
                        return r.type;
                    }));
                }).filter(function (t) {
                    return t.isCustomType;
                }), function (t) {
                    return t.type;
                }).concat([_Builtins.ApiFactoryTypeInfo, _Builtins.ApiTypeInfo, _Builtins.ConfigureRequestTypeInfo, _Builtins.HttpOptionsTypeInfo, _Builtins.HttpRequestTypeInfo, _Builtins.HttpResponseTypeInfo, _Builtins.AssertTypeInfo, _Builtins.CheckTypeInfo, _Builtins.IsNumberTypeInfo, _Builtins.IsStringTypeInfo, _Builtins.IsBooleanTypeInfo, _Builtins.IsArrayTypeInfo, _Builtins.HasShapeTypeInfo])
            };
        })).concat([{
            name: "ProxyUtils",
            path: Path.resolve(outDir, "ProxyUtils.ts"),
            kind: _Metadata.ModuleKind.Util,
            exports: [_Builtins.ApiFactoryTypeInfo, _Builtins.ApiTypeInfo, _Builtins.ConfigureRequestTypeInfo, _Builtins.HttpOptionsTypeInfo, _Builtins.HttpRequestTypeInfo, _Builtins.HttpResponseTypeInfo, _Builtins.AssertTypeInfo, _Builtins.CheckTypeInfo, _Builtins.IsNumberTypeInfo, _Builtins.IsStringTypeInfo, _Builtins.IsBooleanTypeInfo, _Builtins.IsArrayTypeInfo, _Builtins.HasShapeTypeInfo],
            imports: []
        }]);
        moduleGraph = moduleGraph.concat([{
            name: "ModelIndex",
            path: Path.resolve(getModelDirectory(outDir), "index.ts"),
            kind: _Metadata.ModuleKind.Index,
            exports: [],
            imports: moduleGraph.filter(function (m) {
                return m.kind === _Metadata.ModuleKind.Model;
            }).reduce(function (prev, next) {
                return prev.concat(next.exports);
            }, [])
        }]);
        moduleGraph = moduleGraph.concat([{
            name: "ProxyIndex",
            path: Path.resolve(getProxyDirectory(outDir), "index.ts"),
            kind: _Metadata.ModuleKind.Index,
            exports: [],
            imports: moduleGraph.filter(function (m) {
                return m.kind === _Metadata.ModuleKind.Proxy;
            }).map(function (m) {
                return (0, _Metadata.createTypeInfo)(m.name);
            })
        }]);
        moduleGraph = moduleGraph.concat([{
            name: "Index",
            path: Path.resolve(outDir, "index.ts"),
            kind: _Metadata.ModuleKind.EndpointIndex,
            exports: [],
            imports: moduleGraph.filter(function (m) {
                return m.kind === _Metadata.ModuleKind.Proxy;
            }).map(function (m) {
                return (0, _Metadata.createTypeInfo)(m.name);
            }).concat([_Builtins.ApiFactoryTypeInfo])
        }]);
        var resolver = getModuleResolver(moduleGraph);
        var moduleOutputs = moduleGraph.filter(function (m) {
            return m.kind !== _Metadata.ModuleKind.Util || !preserveUtils;
        }).map(function (m) {
            return moduleEmitters[m.kind](m, resolver);
        });
        console.log(moduleGraph);
        moduleOutputs.forEach(function (b) {
            FS.writeFileSync(b.path, b.content + (0, _Emitter.newline)());
        });
    });
}
var defaultManifest = {
    url: "",
    out: "",
    flush: false,
    preserveUtils: false
};
init(process.cwd(), (0, _assign2.default)({}, defaultManifest, parseArgs(process.argv)));