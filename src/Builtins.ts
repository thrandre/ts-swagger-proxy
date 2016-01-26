import { ITypeInfo } from "./Metadata";

export const ApiTypeInfo: ITypeInfo = { type: "Api", isArray: false, isCustomType: true, isProxyUtil: true };
export const ApiFactoryTypeInfo: ITypeInfo = { type: "ApiFactory", isArray: false, isCustomType: true, isProxyUtil: true };
export const HttpRequestTypeInfo: ITypeInfo = { type: "HttpRequest", isArray: false, isCustomType: true, isProxyUtil: true };
export const HttpResponseTypeInfo: ITypeInfo = { type: "HttpResponse", isArray: false, isCustomType: true, isProxyUtil: true };
export const HttpOptionsTypeInfo: ITypeInfo = { type: "HttpOptions", isArray: false, isCustomType: true, isProxyUtil: true };
export const ConfigureRequestTypeInfo: ITypeInfo = { type: "ConfigureRequest", isArray: false, isCustomType: true, isProxyUtil: true };