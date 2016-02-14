import { ITypeInfo, createTypeInfo } from "./Metadata";

export const ApiTypeInfo = createTypeInfo("Api", false, true, true);
export const ApiFactoryTypeInfo = createTypeInfo("ApiFactory", false, true, true);
export const HttpRequestTypeInfo = createTypeInfo("HttpRequest", false, true, true);
export const HttpResponseTypeInfo = createTypeInfo("HttpResponse", false, true, true);
export const HttpOptionsTypeInfo = createTypeInfo("HttpOptions", false, true, true);
export const ConfigureRequestTypeInfo = createTypeInfo("ConfigureRequest", false, true, true);
export const AssertTypeInfo = createTypeInfo("assert", false, true, true);
export const CheckTypeInfo = createTypeInfo("check", false, true, true);
export const IsNumberTypeInfo = createTypeInfo("isNumber", false, true, true);
export const IsStringTypeInfo = createTypeInfo("isString", false, true, true);
export const IsBooleanTypeInfo = createTypeInfo("isBoolean", false, true, true);
export const IsArrayTypeInfo = createTypeInfo("isArray", false, true, true);
export const HasShapeTypeInfo = createTypeInfo("hasShape", false, true, true);

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
}

export function assert(...results: string[]) {
	return out => results
		.filter(r => !!r)
		.map(r => \`API: \${ r }\`)
		.forEach(out);
}

export function check(name: string, type: string, val: any, optional: boolean, location: string, checker: (val: any) => boolean) {
	return !(typeof val !== "undefined" && val !== null && checker(val)) && 
		\`\${ location } "\${ name }" should be of type "\${ type }", but has value \${ JSON.stringify(val) } of type "\${ typeof val }".\`;
}

export function isNumber(name: string, val: any, optional: boolean, location: string): string {
	return check(name, "number", val, optional, location, v => _.isNumber(v));
}

export function isString(name: string, val: any, optional: boolean, location: string): string {
	return check(name, "string", val, optional, location, v => _.isString(v));
}

export function isBoolean(name: string, val: any, optional: boolean, location: string): string {
	return check(name, "boolean", val, optional, location, v => _.isBoolean(v));
}

export function isArray(name: string, val: any[], optional: boolean, location: string, shape?: any): string {
	return check(
		name, 
		JSON.stringify(shape || val), 
		val, 
		optional, 
		location, 
		v => _.isArray(v) && (!shape || v.every(i => !hasShape("_", i, false, "_", shape)))
	);
}

export function hasShape(name: string, val: any, optional: boolean, location: string, shape: any): string {
	return shape && check(
		name,
		JSON.stringify(shape),
		val,
		optional,
		location,
		v => Object.keys(v).length === Object.keys(shape).length &&
			Object.keys(v).every(k => Object.keys(shape).some(k2 => k === k2))
	);
}`;