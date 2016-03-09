import { ITypeInfo, createTypeInfo } from "./Metadata";

export const ApiTypeInfo = createTypeInfo("Api", false, true, true);
export const ApiFactoryTypeInfo = createTypeInfo("ApiFactory", false, true, true);
export const HttpRequestTypeInfo = createTypeInfo("HttpRequest", false, true, true);
export const HttpResponseTypeInfo = createTypeInfo("HttpResponse", false, true, true);
export const HttpOptionsTypeInfo = createTypeInfo("HttpOptions", false, true, true);
export const ConfigureRequestTypeInfo = createTypeInfo("ConfigureRequest", false, true, true);

export const ProxyUtils = 
`import * as _ from "lodash";

export interface HttpRequest {
    query(q: any);
    send(d: any);
}

export interface ConfigureRequest {
    (request: HttpRequest): void;
}

export interface ApiFactory {
    (name: string): Api;
}

export interface HttpOptions {
    url: string;
    actionKey: string;
    emitPending?: boolean;
    keepActiveRequests?: boolean;
}

export interface HttpResponse<T> {
    body: T;
}

export interface Api {
    get<T>(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<T>>;
    get(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;
    post(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;
    put(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;
    del(options: HttpOptions, setup?: (req: any) => void): Promise<HttpResponse<any>>;
}`;
