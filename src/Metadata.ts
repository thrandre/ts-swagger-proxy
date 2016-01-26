export interface IModule {
    name: string;
    models: IModel[];
}

export interface IModel {
    name: string;
    properties: IProperty[];
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
    isProxyUtil?: boolean;
}

export interface IEndpointGroup {
    name: string;
    endpoints: IEndpoint[];
}