"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.firstCharToUpperCase = exports.firstCharToLowerCase = exports.tab = exports.newline = undefined;
exports.expandTypeInfo = expandTypeInfo;

var _Builtins = require("./Builtins");

var _Utils = require("./Utils");

var newline = exports.newline = function newline() {
    var count = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    return "\r\n".repeat(count);
};
var tab = exports.tab = function tab() {
    var count = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    return "\t".repeat(count);
};
var firstCharToLowerCase = exports.firstCharToLowerCase = function firstCharToLowerCase(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
};
var firstCharToUpperCase = exports.firstCharToUpperCase = function firstCharToUpperCase(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
};
function expandTypeInfo(type) {
    return type.isArray ? type.type + "[]" : type.type;
}
var Emitter;
(function (Emitter) {
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
    Emitter.$str = $str;
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
    Emitter.$block = $block;
    function $import(aliases, ref) {
        return function () {
            return "import { " + aliases.join(", ") + " } from \"" + ref + "\";";
        };
    }
    Emitter.$import = $import;
    function $module(children) {
        return function () {
            return children.map(function (c) {
                return c();
            }).filter(function (c) {
                return !!c;
            }).join(newline(2));
        };
    }
    Emitter.$module = $module;
    function $model(model) {
        return $block([$str("export interface " + model.name + " {"), $block(model.properties.map(function (p) {
            return $str(p.name + ": " + expandTypeInfo(p.type) + ";");
        }), 1), $str("}")]);
    }
    Emitter.$model = $model;
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
            return "Promise<" + _Builtins.HttpResponseTypeInfo.type + "<" + type + ">>";
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
        var needsRequestBuilder = needsQueryBuilder || needsBodyBuilder;
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
        return $block([$str([prependWith || "", "(" + args + "): " + transformMethodReturnType(returnType) + " {"].join("")), $block([$str("const options: " + _Builtins.HttpOptionsTypeInfo.type + " = {"), $block([$str("actionKey: \"" + getActionKey(proxyMethod) + "\""), $str("url: `" + transformUriParamsInPath(path) + "`"), $str("emitPending: true")], level + 2, "," + newline()), $str("};"), needsQueryBuilder && $str("const query = " + getQueryParams(proxyMethod.parameters) + ";"), needsRequestBuilder && $str("const buildRequest: " + _Builtins.ConfigureRequestTypeInfo.type + " = req => req." + [needsQueryBuilder && "query(query)", needsBodyBuilder && "send(" + getBodyParam(proxyMethod.parameters) + ")", ";"].filter(function (p) {
            return !!p;
        }).join(""))], level + 1), $block([$str("return api." + mapMethod(proxyMethod.method, returnType) + "(" + ["options", needsRequestBuilder && "buildRequest"].filter(function (a) {
            return !!a;
        }).join(", ") + ");")], level + 1), $str("}")], level);
    }
    Emitter.$proxyMethod = $proxyMethod;
    function $proxy(endpointGroup) {
        var proxyName = getProxyName(endpointGroup.name);
        return $block([$str("export default function " + proxyName + "(apiFactory: " + _Builtins.ApiFactoryTypeInfo.type + ") {"), $block([$str("const api = apiFactory(\"" + proxyName + "\");"), $str("return {"), $block((0, _Utils.mapMany)(endpointGroup.endpoints, function (e) {
            return e.methods.map(function (m) {
                return { method: m, path: e.path };
            });
        }).map(function (e) {
            return $proxyMethod(e.path, e.method, firstCharToLowerCase(e.method.name), 2);
        }), 1, "," + newline()), $str("};")], 1), $str("}")]);
    }
    Emitter.$proxy = $proxy;
})(Emitter || (Emitter = {}));
exports.default = Emitter;