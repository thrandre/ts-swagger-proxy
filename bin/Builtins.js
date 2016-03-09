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
var ProxyUtils = exports.ProxyUtils = "import * as _ from \"lodash\";\n\nexport interface HttpRequest {\n    query(q: any);\n    send(d: any);\n}\n\nexport interface ConfigureRequest {\n    (request: HttpRequest): void;\n}\n\nexport interface ApiFactory {\n    (name: string): Api;\n}\n\nexport interface HttpOptions {\n    url: string;\n    actionKey: string;\n    emitPending?: boolean;\n    keepActiveRequests?: boolean;\n}\n\nexport interface HttpResponse<T> {\n    body: T;\n}\n\nexport interface Api {\n    get<T>(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<T>>;\n    get(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n    post(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n    put(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n    del(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n}";