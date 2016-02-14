"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ProxyUtils = exports.HasShapeTypeInfo = exports.IsArrayTypeInfo = exports.IsBooleanTypeInfo = exports.IsStringTypeInfo = exports.IsNumberTypeInfo = exports.CheckTypeInfo = exports.AssertTypeInfo = exports.ConfigureRequestTypeInfo = exports.HttpOptionsTypeInfo = exports.HttpResponseTypeInfo = exports.HttpRequestTypeInfo = exports.ApiFactoryTypeInfo = exports.ApiTypeInfo = undefined;

var _Metadata = require("./Metadata");

var ApiTypeInfo = exports.ApiTypeInfo = (0, _Metadata.createTypeInfo)("Api", false, true, true);
var ApiFactoryTypeInfo = exports.ApiFactoryTypeInfo = (0, _Metadata.createTypeInfo)("ApiFactory", false, true, true);
var HttpRequestTypeInfo = exports.HttpRequestTypeInfo = (0, _Metadata.createTypeInfo)("HttpRequest", false, true, true);
var HttpResponseTypeInfo = exports.HttpResponseTypeInfo = (0, _Metadata.createTypeInfo)("HttpResponse", false, true, true);
var HttpOptionsTypeInfo = exports.HttpOptionsTypeInfo = (0, _Metadata.createTypeInfo)("HttpOptions", false, true, true);
var ConfigureRequestTypeInfo = exports.ConfigureRequestTypeInfo = (0, _Metadata.createTypeInfo)("ConfigureRequest", false, true, true);
var AssertTypeInfo = exports.AssertTypeInfo = (0, _Metadata.createTypeInfo)("assert", false, true, true);
var CheckTypeInfo = exports.CheckTypeInfo = (0, _Metadata.createTypeInfo)("check", false, true, true);
var IsNumberTypeInfo = exports.IsNumberTypeInfo = (0, _Metadata.createTypeInfo)("isNumber", false, true, true);
var IsStringTypeInfo = exports.IsStringTypeInfo = (0, _Metadata.createTypeInfo)("isString", false, true, true);
var IsBooleanTypeInfo = exports.IsBooleanTypeInfo = (0, _Metadata.createTypeInfo)("isBoolean", false, true, true);
var IsArrayTypeInfo = exports.IsArrayTypeInfo = (0, _Metadata.createTypeInfo)("isArray", false, true, true);
var HasShapeTypeInfo = exports.HasShapeTypeInfo = (0, _Metadata.createTypeInfo)("hasShape", false, true, true);
var ProxyUtils = exports.ProxyUtils = "import * as _ from \"lodash\";\n\nexport interface HttpRequest {\n    query(q: any);\n    send(d: any);\n}\n\nexport interface ConfigureRequest {\n    (request: HttpRequest): void;\n}\n\nexport interface ApiFactory {\n    (name: string): Api;\n}\n\nexport interface HttpOptions {\n    url: string;\n    actionKey: string;\n    emitPending?: boolean;\n    keepActiveRequests?: boolean;\n}\n\nexport interface HttpResponse<T> {\n    body: T;\n}\n\nexport interface Api {\n    get<T>(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<T>>;\n    get(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n    post(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n    put(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n    del(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n}\n\nexport function assert(...results: string[]) {\n\treturn out => results\n\t\t.filter(r => !!r)\n\t\t.map(r => `API: ${ r }`)\n\t\t.forEach(out);\n}\n\nexport function check(name: string, type: string, val: any, optional: boolean, location: string, checker: (val: any) => boolean) {\n\treturn !(typeof val !== \"undefined\" && val !== null && checker(val)) && \n\t\t`${ location } \"${ name }\" should be of type \"${ type }\", but has value ${ JSON.stringify(val) } of type \"${ typeof val }\".`;\n}\n\nexport function isNumber(name: string, val: any, optional: boolean, location: string): string {\n\treturn check(name, \"number\", val, optional, location, v => _.isNumber(v));\n}\n\nexport function isString(name: string, val: any, optional: boolean, location: string): string {\n\treturn check(name, \"string\", val, optional, location, v => _.isString(v));\n}\n\nexport function isBoolean(name: string, val: any, optional: boolean, location: string): string {\n\treturn check(name, \"boolean\", val, optional, location, v => _.isBoolean(v));\n}\n\nexport function isArray(name: string, val: any[], optional: boolean, location: string, shape?: any): string {\n\treturn check(\n\t\tname, \n\t\tJSON.stringify(shape || val), \n\t\tval, \n\t\toptional, \n\t\tlocation, \n\t\tv => _.isArray(v) && (!shape || v.every(i => !hasShape(\"_\", i, false, \"_\", shape)))\n\t);\n}\n\nexport function hasShape(name: string, val: any, optional: boolean, location: string, shape: any): string {\n\treturn shape && check(\n\t\tname,\n\t\tJSON.stringify(shape),\n\t\tval,\n\t\toptional,\n\t\tlocation,\n\t\tv => Object.keys(v).length === Object.keys(shape).length &&\n\t\t\tObject.keys(v).every(k => Object.keys(shape).some(k2 => k === k2))\n\t);\n}";