"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _superagent = require("superagent");

var Request = _interopRequireWildcard(_superagent);

var _fs = require("fs");

var FS = _interopRequireWildcard(_fs);

var _path = require("path");

var Path = _interopRequireWildcard(_path);

var _Builtins = require("./Builtins");

var _Utils = require("./Utils");

var _Emitter = require("./Emitter");

var _FsUtils = require("./FsUtils");

var _Swagger = require("./Swagger");

var _Swagger2 = _interopRequireDefault(_Swagger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/// <reference path="./typings/typings.d.ts" />

var ModuleEmitter = function () {
    function ModuleEmitter(writeFile) {
        (0, _classCallCheck3.default)(this, ModuleEmitter);

        this.writeFile = writeFile;
    }

    (0, _createClass3.default)(ModuleEmitter, [{
        key: "emit",
        value: function emit(name, data) {
            this.writeFile(name, data + (0, _Emitter.newline)());
        }
    }]);
    return ModuleEmitter;
}();

function groupEndpoints(endpoints) {
    var groups = (0, _Utils.groupBy)(endpoints, function (e) {
        return e.group;
    });
    return (0, _keys2.default)(groups).map(function (k) {
        return {
            name: k,
            endpoints: groups[k]
        };
    });
}
var parser = new _Swagger2.default();
var emitter = new ModuleEmitter(function (name, data) {
    var path = "./modules/" + name + ".ts";
    FS.writeFile(path, data);
});
var getModelDirectory = function getModelDirectory(basepath) {
    return Path.resolve(basepath, "./models");
};
var getProxyDirectory = function getProxyDirectory(basepath) {
    return Path.resolve(basepath, "./proxies");
};
function init(workingDirectory) {
    var manifestPath = Path.resolve(workingDirectory, "ts-swagger-proxy.json");
    var manifest = JSON.parse(FS.readFileSync(manifestPath, "utf-8"));
    var outDir = Path.resolve(Path.dirname(manifestPath), manifest.out);
    if (manifest.flush) {
        (0, _FsUtils.removeDirectory)(outDir);
    }
    (0, _FsUtils.ensureDirectoriesExists)(outDir, getModelDirectory(outDir), getProxyDirectory(outDir));
    generateProxy(manifest.url, outDir);
}
function createTypeInfo(type) {
    var isArray = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var isCustomType = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    return {
        type: type,
        isArray: isArray,
        isCustomType: isCustomType
    };
}
function resolveModuleDependencies(mod, resolve) {
    var deps = (0, _Utils.groupBy)(mod.imports, function (i) {
        return resolve(i).path;
    });
    return (0, _keys2.default)(deps).reduce(function (prev, next) {
        var relativePath = ((Path.relative(Path.dirname(mod.path), Path.dirname(next)) || ".") + Path.sep + Path.basename(next, ".ts")).replace(/\\/g, "/");
        prev[relativePath] = deps[next].map(function (d) {
            return d.type;
        });
        return prev;
    }, {});
}
function generateProxy(url, outDir) {
    Request.get(url, function (err, res) {
        if (err) {
            console.error(err);
        }
        var result = parser.parse(res.body);
        var models = result.models;
        var endpointGroups = groupEndpoints(result.endpoints);
        var modules = models.map(function (m) {
            return {
                name: m.name,
                path: Path.resolve(getModelDirectory(outDir), m.name + ".ts"),
                exports: [{ type: m.name, isArray: false, isCustomType: false, isProxyUtil: false }],
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
                exports: [{ type: g.name, isArray: false, isCustomType: false, isProxyUtil: false }],
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
                }).concat([_Builtins.ApiFactoryTypeInfo, _Builtins.ApiTypeInfo, _Builtins.ConfigureRequestTypeInfo, _Builtins.HttpOptionsTypeInfo, _Builtins.HttpRequestTypeInfo, _Builtins.HttpResponseTypeInfo])
            };
        })).concat([{
            name: "ProxyUtils",
            path: Path.resolve(outDir, "ProxyUtils.ts"),
            exports: [_Builtins.ApiFactoryTypeInfo, _Builtins.ApiTypeInfo, _Builtins.ConfigureRequestTypeInfo, _Builtins.HttpOptionsTypeInfo, _Builtins.HttpRequestTypeInfo, _Builtins.HttpResponseTypeInfo],
            imports: []
        }]);
        modules.forEach(function (m) {
            return resolveModuleDependencies(m, function (type) {
                return modules.find(function (m) {
                    return m.exports.some(function (e) {
                        return e.type === type.type;
                    });
                });
            });
        });
        FS.writeFileSync("foo.json", (0, _stringify2.default)(modules));
    });
}
init(process.cwd());