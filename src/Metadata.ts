export interface IModel {
    name: string;
    properties: IProperty[];
	enum: string[];
}

export interface IProperty {
    name: string;
    type: ITypeInfo;
}

export interface IEndpoint {
    path: string;
    methods: IMethod[];
    group: string;
}

export interface IParameter {
    name: string;
    in: string;
    required: boolean;
    type: ITypeInfo;
}

export interface IResponse {
    code: string;
    type: ITypeInfo;
}

export interface IMethod {
    method: string;
    name: string;
    tags: string[];
    parameters: IParameter[];
    responses: IResponse[];
}

export interface ITypeInfo {
    type: string;
    isArray: boolean;
    isCustomType: boolean;
    isBuiltin?: boolean;
}

export interface IEndpointGroup {
    name: string;
    endpoints: IEndpoint[];
}

export interface IModule {
    name: string;
    path: string;
    kind: ModuleKind;
    model?: IModel;
    endpointGroup?: IEndpointGroup;
    exports: ITypeInfo[];
    imports: ITypeInfo[];
}

export interface IDependencyMap {
    [key: string]: string[]
}

export enum ModuleKind {
    Model,
    Proxy,
    Util,
    Index,
    EndpointIndex
}

export function createTypeInfo(type: string, isArray: boolean = false, isCustomType: boolean = false, isBuiltin: boolean = false): ITypeInfo {
    return {
      type,
      isArray,
      isCustomType,
      isBuiltin
    };
}