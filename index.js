"use strict";

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeDirectory(path) {
    if (FS.existsSync(path)) {
        FS.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (FS.lstatSync(curPath).isDirectory()) {
                removeDirectory(curPath);
            } else {
                FS.unlinkSync(curPath);
            }
        });
        FS.rmdirSync(path);
    }
} /// <reference path="./typings/typings.d.ts" />

;
function ensureDirectoryExists(path, cb) {
    FS.mkdir(path, function (err) {
        if (!err) {
            return cb(err);
        }
        if (err) {
            return err.code == "EEXIST" ? cb(null) : cb(err);
        }
        return cb(null);
    });
}
var manifestPath = Path.resolve(process.cwd(), "ts-swagger-proxy.json");
var manifest = JSON.parse(FS.readFileSync(manifestPath, "utf-8"));
var outDir = Path.resolve(Path.dirname(manifestPath), manifest.out);
var modelDir = Path.resolve(outDir, "./models");
var proxyDir = Path.resolve(outDir, "./proxies");
console.log(outDir);
removeDirectory(outDir);
ensureDirectoryExists(outDir, console.log);
ensureDirectoryExists(modelDir, console.log);
ensureDirectoryExists(proxyDir, console.log);
function resolveJsonRef(root, ref) {
    var allPathSegments = ref.split("/");
    var pathSegments = allPathSegments[0] === "#" ? allPathSegments.slice(1) : allPathSegments;
    return [pathSegments[pathSegments.length - 1], pathSegments.reduce(function (prev, next) {
        return prev[next];
    }, root)];
}
var Swagger;
(function (Swagger) {
    function mapType(definedType, data) {
        var builtins = {
            "number": true,
            "string": true,
            "boolean": true,
            "any": true,
            "object": true
        };
        var defaultTypeConversionMap = {
            "integer": "number",
            "bool": "boolean",
            "object": "any",
            "Object": "any"
        };
        var convert = function convert(type) {
            return defaultTypeConversionMap[type] ? defaultTypeConversionMap[type] : type;
        };
        var toTypeInfo = function toTypeInfo(type, isArray) {
            return {
                type: type,
                isArray: isArray,
                isCustomType: !builtins[type]
            };
        };
        if (definedType.$ref) {
            return toTypeInfo(convert(resolveJsonRef(data, definedType.$ref)[0]), false);
        }
        if (definedType.type === "array") {
            return toTypeInfo(mapType(definedType.items, data).type, true);
        }
        return toTypeInfo(convert(definedType.type), false);
    }

    var ModelParser = function () {
        function ModelParser() {
            (0, _classCallCheck3.default)(this, ModelParser);
        }

        (0, _createClass3.default)(ModelParser, null, [{
            key: "getModelProperty",
            value: function getModelProperty(name, propertyDefinition, data) {
                return {
                    name: name,
                    type: mapType(propertyDefinition, data)
                };
            }
        }, {
            key: "getModelProperties",
            value: function getModelProperties(properties, data) {
                var _this = this;

                return (0, _keys2.default)(properties).map(function (k) {
                    return _this.getModelProperty(k, properties[k], data);
                });
            }
        }, {
            key: "getModel",
            value: function getModel(name, typeDefinition, data) {
                return {
                    name: name,
                    properties: this.getModelProperties(typeDefinition.properties, data)
                };
            }
        }, {
            key: "getModels",
            value: function getModels(data) {
                var _this2 = this;

                return (0, _keys2.default)(data.definitions).map(function (k) {
                    return _this2.getModel(k, data.definitions[k], data);
                }).filter(function (m) {
                    return m.name !== "Object";
                });
            }
        }]);
        return ModelParser;
    }();

    var EndpointParser = function () {
        function EndpointParser() {
            (0, _classCallCheck3.default)(this, EndpointParser);
        }

        (0, _createClass3.default)(EndpointParser, null, [{
            key: "getEndpointMethodResponse",
            value: function getEndpointMethodResponse(code, response, data) {
                return {
                    code: code,
                    type: code === "200" ? response.schema ? mapType(response.schema, data) : null : { type: "void", isArray: false, isCustomType: false }
                };
            }
        }, {
            key: "getEndpointParameter",
            value: function getEndpointParameter(param, data) {
                return {
                    name: param.name,
                    in: param.in,
                    required: param.required,
                    type: mapType(param.schema ? param.schema : param, data)
                };
            }
        }, {
            key: "getEndpointMethod",
            value: function getEndpointMethod(method, endpoint, data) {
                var _this3 = this;

                var getMethodName = function getMethodName(id) {
                    var segments = id.split("_");
                    return segments[segments.length - 1];
                };
                return {
                    method: method,
                    name: getMethodName(endpoint.operationId),
                    tags: endpoint.tags,
                    parameters: (endpoint.parameters || []).map(function (p) {
                        return _this3.getEndpointParameter(p, data);
                    }),
                    responses: (0, _keys2.default)(endpoint.responses).map(function (r) {
                        return _this3.getEndpointMethodResponse(r, endpoint.responses[r], data);
                    })
                };
            }
        }, {
            key: "getEndpoint",
            value: function getEndpoint(path, pathData, data) {
                var _this4 = this;

                var methods = (0, _keys2.default)(pathData).map(function (p) {
                    return _this4.getEndpointMethod(p, pathData[p], data);
                });
                return {
                    path: path,
                    methods: methods,
                    group: methods[0].tags[0]
                };
            }
        }, {
            key: "getEndpoints",
            value: function getEndpoints(data) {
                var _this5 = this;

                return (0, _keys2.default)(data.paths).map(function (k) {
                    return _this5.getEndpoint(k, data.paths[k], data);
                });
            }
        }]);
        return EndpointParser;
    }();

    var Parser = function () {
        function Parser() {
            (0, _classCallCheck3.default)(this, Parser);
        }

        (0, _createClass3.default)(Parser, [{
            key: "parse",
            value: function parse(response) {
                var responseObj = response;
                var models = ModelParser.getModels(responseObj);
                var endpoints = EndpointParser.getEndpoints(responseObj);
                return {
                    models: models,
                    endpoints: endpoints
                };
            }
        }]);
        return Parser;
    }();

    Swagger.Parser = Parser;
})(Swagger || (Swagger = {}));
var newline = function newline() {
    var count = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    return "\r\n".repeat(count);
};
var tab = function tab() {
    var count = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    return "\t".repeat(count);
};
var firstCharToLowerCase = function firstCharToLowerCase(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
};
var firstCharToUpperCase = function firstCharToUpperCase(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
};
function expandTypeInfo(type) {
    return type.isArray ? type.type + "[]" : type.type;
}
function groupBy(arr, keySelector) {
    keySelector = keySelector || function (e) {
        return e.toString();
    };
    return arr.reduce(function (p, n) {
        var key = keySelector(n);
        var arrOfArr = p[key] || (p[key] = []);
        arrOfArr.push(n);
        return p;
    }, {});
}
function unique(arr, keySelector) {
    keySelector = keySelector || function (e) {
        return e.toString();
    };
    var groups = groupBy(arr, keySelector);
    return (0, _keys2.default)(groups).map(function (k) {
        return groups[k][0];
    });
}
function mapMany(arr, selector) {
    return arr.map(selector).reduce(function (prev, next) {
        return prev.concat(next);
    }, []);
}

var ModuleEmitter = function () {
    function ModuleEmitter(writeFile) {
        (0, _classCallCheck3.default)(this, ModuleEmitter);

        this.writeFile = writeFile;
    }

    (0, _createClass3.default)(ModuleEmitter, [{
        key: "emit",
        value: function emit(name, data) {
            this.writeFile(name, data + newline());
        }
    }]);
    return ModuleEmitter;
}();

var ApiTypeInfo = { type: "Api", isArray: false, isCustomType: true, isProxyUtil: true };
var ApiFactoryTypeInfo = { type: "ApiFactory", isArray: false, isCustomType: true, isProxyUtil: true };
var HttpRequestTypeInfo = { type: "HttpRequest", isArray: false, isCustomType: true, isProxyUtil: true };
var HttpResponseTypeInfo = { type: "HttpResponse", isArray: false, isCustomType: true, isProxyUtil: true };
var HttpOptionsTypeInfo = { type: "HttpOptions", isArray: false, isCustomType: true, isProxyUtil: true };
var ConfigureRequestTypeInfo = { type: "ConfigureRequest", isArray: false, isCustomType: true, isProxyUtil: true };
var Emitters;
(function (Emitters) {
    var getProxyName = function getProxyName(name) {
        return firstCharToLowerCase(name + "Proxy");
    };
    var getProxyMethodName = function getProxyMethodName(name) {
        return firstCharToLowerCase(name);
    };
    function $str(str) {
        return function () {
            var level = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            return tab(level) + str;
        };
    }
    Emitters.$str = $str;
    function $block(children) {
        var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var delimiter = arguments[2];

        delimiter = delimiter !== null && typeof delimiter !== "undefined" ? delimiter : newline();
        return function () {
            return children.filter(function (c) {
                return !!c;
            }).map(function (c) {
                return c(level);
            }).join(delimiter);
        };
    }
    Emitters.$block = $block;
    function $import(aliases, ref) {
        return function () {
            return "import { " + aliases.join(", ") + " } from \"" + ref + "\";";
        };
    }
    Emitters.$import = $import;
    function $module(children) {
        return function () {
            return children.map(function (c) {
                return c();
            }).filter(function (c) {
                return !!c;
            }).join(newline(2));
        };
    }
    Emitters.$module = $module;
    function $model(model) {
        return $block([$str("export interface " + model.name + " {"), $block(model.properties.map(function (p) {
            return $str(p.name + ": " + expandTypeInfo(p.type) + ";");
        }), 1), $str("}")]);
    }
    Emitters.$model = $model;
    function $proxyMethod(path, proxyMethod, prependWith) {
        var level = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        var sanitizeArgumentName = function sanitizeArgumentName(argumentName) {
            return argumentName.replace(/\./g, "_");
        };
        var getMethodArguments = function getMethodArguments(method) {
            return method.parameters.map(function (p) {
                return "" + sanitizeArgumentName(p.name) + (!p.required ? "?" : "") + ": " + expandTypeInfo(p.type);
            }).join(", ");
        };
        var getMethodReturnType = function getMethodReturnType(method) {
            return method.responses.length > 0 ? expandTypeInfo(method.responses[0].type) : "void";
        };
        var transformMethodReturnType = function transformMethodReturnType(type) {
            return "Promise<" + HttpResponseTypeInfo.type + "<" + type + ">>";
        };
        var transformUriParamsInPath = function transformUriParamsInPath(path) {
            return path.replace(/\{(.*?)\}/g, "$${ $1 }");
        };
        var mapMethod = function mapMethod(method, type) {
            return {
                get: "get<" + type + ">",
                post: "post",
                put: "put",
                delete: "del"
            }[method];
        };
        var getActionKey = function getActionKey(method) {
            return method.tags[0] + "_" + method.name;
        };
        var needsQueryBuilder = function (params) {
            return params.some(function (p) {
                return p.in === "query";
            });
        }(proxyMethod.parameters);
        var needsBodyBuilder = function (params) {
            return params.some(function (p) {
                return p.in === "body";
            });
        }(proxyMethod.parameters);
        var needsRequestBuilder = function needsRequestBuilder(params) {
            return needsQueryBuilder || needsBodyBuilder;
        };
        var getQueryParams = function getQueryParams(params) {
            var queryParams = params.filter(function (p) {
                return p.in === "query";
            });
            return "{ " + queryParams.map(function (p) {
                return p.name;
            }).join(", ") + " }";
        };
        var getBodyParam = function getBodyParam(params) {
            return params.find(function (p) {
                return p.in === "body";
            }).name;
        };
        var args = getMethodArguments(proxyMethod);
        var returnType = getMethodReturnType(proxyMethod);
        return $block([$str([prependWith || "", "(" + args + "): " + transformMethodReturnType(returnType) + " {"].join("")), $block([$str("const options: " + HttpOptionsTypeInfo.type + " = {"), $block([$str("actionKey: \"" + getActionKey(proxyMethod) + "\""), $str("url: `" + transformUriParamsInPath(path) + "`"), $str("emitPending: true")], level + 2, "," + newline()), $str("};"), needsQueryBuilder && $str("const query = " + getQueryParams(proxyMethod.parameters) + ";"), needsRequestBuilder && $str("const buildRequest: " + ConfigureRequestTypeInfo.type + " = req => req." + [needsQueryBuilder && "query(query)", needsBodyBuilder && "send(" + getBodyParam(proxyMethod.parameters) + ")", ";"].filter(function (p) {
            return !!p;
        }).join(""))], level + 1), $block([$str("return api." + mapMethod(proxyMethod.method, returnType) + "(" + ["options", needsRequestBuilder(proxyMethod.parameters) && "buildRequest"].filter(function (a) {
            return !!a;
        }).join(", ") + ");")], level + 1), $str("}")], level);
    }
    Emitters.$proxyMethod = $proxyMethod;
    function $proxy(endpointGroup) {
        var proxyName = getProxyName(endpointGroup.name);
        return $block([$str("export default function " + proxyName + "(apiFactory: " + ApiFactoryTypeInfo.type + ") {"), $block([$str("const api = apiFactory(\"" + proxyName + "\");"), $str("return {"), $block(mapMany(endpointGroup.endpoints, function (e) {
            return e.methods.map(function (m) {
                return { method: m, path: e.path };
            });
        }).map(function (e) {
            return $proxyMethod(e.path, e.method, firstCharToLowerCase(e.method.name), 2);
        }), 1, "," + newline()), $str("};")], 1), $str("}")]);
    }
    Emitters.$proxy = $proxy;
})(Emitters || (Emitters = {}));
function groupEndpoints(endpoints) {
    var groups = groupBy(endpoints, function (e) {
        return e.group;
    });
    return (0, _keys2.default)(groups).map(function (k) {
        return {
            name: k,
            endpoints: groups[k]
        };
    });
}
var parser = new Swagger.Parser();
var emitter = new ModuleEmitter(function (name, data) {
    var path = "./modules/" + name + ".ts";
    FS.writeFile(path, data);
});
function resolveDependencies(types, resolve) {
    return groupBy(unique(types.filter(function (t) {
        return t.isCustomType;
    }), function (t) {
        return t.type;
    }), function (t) {
        return resolve(t);
    });
}
function resolveModule(type) {
    if (type.isProxyUtil) {
        return "./proxyUtils.ts";
    }
    return "./models/" + type.type;
}
Request.get("http://localhost:55037/swagger/docs/v1", function (err, res) {
    if (err) {
        console.error(err);
    }
    var result = parser.parse(res.body);
    var modules = result.models;
    var endpointGroups = groupEndpoints(result.endpoints);
    var bsEnd = endpointGroups[3];
    var bsMeths = mapMany(bsEnd.endpoints, function (e) {
        return e.methods;
    });
    var bsParams = mapMany(bsMeths, function (m) {
        return m.parameters;
    }).map(function (p) {
        return p.type;
    });
    var bsRets = mapMany(bsMeths, function (r) {
        return r.responses;
    }).map(function (r) {
        return r.type;
    });
    var bsDeps = resolveDependencies(bsParams.concat(bsRets).concat([ApiTypeInfo, ApiFactoryTypeInfo, HttpRequestTypeInfo, HttpResponseTypeInfo, HttpOptionsTypeInfo, ConfigureRequestTypeInfo]), resolveModule);
    var bs = Emitters.$module([Emitters.$block((0, _keys2.default)(bsDeps).map(function (k) {
        return Emitters.$import(bsDeps[k].map(function (d) {
            return d.type;
        }), k);
    })), Emitters.$proxy(bsEnd)])();
    modules.forEach(function (m) {
        var deps = resolveDependencies(m.properties.map(function (p) {
            return p.type;
        }), resolveModule);
        emitter.emit(m.name, Emitters.$module([Emitters.$block((0, _keys2.default)(deps).map(function (k) {
            return Emitters.$import(deps[k].map(function (d) {
                return d.type;
            }), k);
        })), Emitters.$model(m)])());
    });
});