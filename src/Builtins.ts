import { ITypeInfo, createTypeInfo } from "./Metadata";

export const ApiTypeInfo: ITypeInfo = createTypeInfo("Api", false, true);
export const ApiFactoryTypeInfo: ITypeInfo = { type: "ApiFactory", isArray: false, isCustomType: true, isProxyUtil: true };
export const HttpRequestTypeInfo: ITypeInfo = { type: "HttpRequest", isArray: false, isCustomType: true, isProxyUtil: true };
export const HttpResponseTypeInfo: ITypeInfo = { type: "HttpResponse", isArray: false, isCustomType: true, isProxyUtil: true };
export const HttpOptionsTypeInfo: ITypeInfo = { type: "HttpOptions", isArray: false, isCustomType: true, isProxyUtil: true };
export const ConfigureRequestTypeInfo: ITypeInfo = { type: "ConfigureRequest", isArray: false, isCustomType: true, isProxyUtil: true };

export const ProxyUtils = 
`interface HttpRequest {
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
}`;