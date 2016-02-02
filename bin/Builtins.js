"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ApiTypeInfo = exports.ApiTypeInfo = { type: "Api", isArray: false, isCustomType: true, isProxyUtil: true };
var ApiFactoryTypeInfo = exports.ApiFactoryTypeInfo = { type: "ApiFactory", isArray: false, isCustomType: true, isProxyUtil: true };
var HttpRequestTypeInfo = exports.HttpRequestTypeInfo = { type: "HttpRequest", isArray: false, isCustomType: true, isProxyUtil: true };
var HttpResponseTypeInfo = exports.HttpResponseTypeInfo = { type: "HttpResponse", isArray: false, isCustomType: true, isProxyUtil: true };
var HttpOptionsTypeInfo = exports.HttpOptionsTypeInfo = { type: "HttpOptions", isArray: false, isCustomType: true, isProxyUtil: true };
var ConfigureRequestTypeInfo = exports.ConfigureRequestTypeInfo = { type: "ConfigureRequest", isArray: false, isCustomType: true, isProxyUtil: true };
var ProxyUtils = exports.ProxyUtils = "interface HttpRequest {\n    query(q: any);\n    send(d: any);\n}\n\ninterface ConfigureRequest {\n    (request: HttpRequest): void;\n}\n\ninterface ApiFactory {\n    (name: string): Api;\n}\n\ninterface HttpOptions {\n    url: string;\n    actionKey: string;\n    emitPending?: boolean;\n    keepActiveRequests?: boolean;\n}\n\ninterface HttpResponse<T> {\n    body: T;\n}\n\ndeclare interface Api {\n    get<T>(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<T>>;\n    get(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n    post(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n    put(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n    del(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;\n}";