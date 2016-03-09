import { IEndpoint, IModel, IMethod, ITypeInfo } from "./Metadata";
import { IParser, IParseResult } from "./Parser";
import { resolveJsonRef } from "./Utils";

namespace Swagger {

    export interface ISwaggerApiResponse {
        swagger: string;
        info: ISwaggerApiResponseInfo;
        host: string;
        schemes: string[];
        paths: { [key: string]: ISwaggerApiResponsePath };
        definitions: { [key: string]: ISwaggerApiResponseTypeDefinition }
    }

    interface ISwaggerApiResponseInfo {
        version: string;
        title: string;
    }

    interface ISwaggerApiResponsePath {
        get: ISwaggerApiResponseEndpoint;
        post: ISwaggerApiResponseEndpoint;
        put: ISwaggerApiResponseEndpoint;
        delete: ISwaggerApiResponseEndpoint;
    }

    interface ISwaggerApiResponseEndpoint {
        tags: string[];
        operationId: string;
        consumes: string[];
        produces: string[];
        parameters: ISwaggerApiResponseEndpointParameter[];
        responses: { [key: string]: ISwaggerApiResponseEndpointResponse };
        deprecated: boolean;
    }

    interface ISwaggerApiResponseEndpointResponse {
        description: string;
        schema: ISwaggerApiResponseDataTypeDefinition;
    }

    interface ISwaggerApiResponseEndpointParameter {
        name: string;
        in: string;
        required: boolean;
        type?: string;
        schema?: ISwaggerApiResponseDataTypeDefinition;
    }

    interface ISwaggerApiResponseTypeDefinition {
        type: string;
        properties: { [key: string]: ISwaggerApiResponsePropertyDefinition }
		enum: string[];
    }

    interface ISwaggerApiResponseDataTypeDefinition {
        type: string;
        format?: string;
        $ref?: string;
        items?: ISwaggerApiResponseDataTypeDefinition;
    }

    interface ISwaggerApiResponsePropertyDefinition extends ISwaggerApiResponseDataTypeDefinition {
    }

    function mapType(definedType: ISwaggerApiResponseDataTypeDefinition, data: ISwaggerApiResponse): ITypeInfo {
        const builtins = {
            "number": true,
            "string": true,
            "boolean": true,
            "any": true,
            "object": true
        };

        const defaultTypeConversionMap = {
            "integer": "number",
            "bool": "boolean",
            "object": "any",
            "Object": "any"
        };

        const convert = (type: string) => defaultTypeConversionMap[type] ?
            defaultTypeConversionMap[type] :
            type;

        const toTypeInfo = (type: string, isArray: boolean): ITypeInfo => ({
            type,
            isArray,
            isCustomType: !builtins[type]
        });

        if (definedType.$ref) {
            return toTypeInfo(convert(resolveJsonRef(data, definedType.$ref)[0]), false);
        }

        if (definedType.type === "array") {
            return toTypeInfo(mapType(definedType.items, data).type, true);
        }

        return toTypeInfo(convert(definedType.type), false);
    }

    class ModelParser {

        private static getModelProperty(name: string, propertyDefinition: ISwaggerApiResponsePropertyDefinition, data: ISwaggerApiResponse) {
            return {
                name,
                type: mapType(propertyDefinition, data)
            };
        }

        private static getModelProperties(properties: { [key: string]: ISwaggerApiResponsePropertyDefinition }, data: ISwaggerApiResponse) {
            return Object
                .keys(properties)
                .map(k => this.getModelProperty(k, properties[k], data));
        }

        private static getModel(name: string, typeDefinition: ISwaggerApiResponseTypeDefinition, data: ISwaggerApiResponse): IModel {
			return {
                name: typeDefinition.enum ? name + "Enum" : name,
                properties: this.getModelProperties(typeDefinition.properties, data),
				enum: typeDefinition.enum
            };
        }

        static getModels(data: ISwaggerApiResponse): IModel[] {
            return Object
                .keys(data.definitions)
                .map(k => this.getModel(k, data.definitions[k], data))
                .filter(m => m.name !== "Object");
        }

    }

    class EndpointParser {

        static getEndpointMethodResponse(code: string, response: ISwaggerApiResponseEndpointResponse, data: ISwaggerApiResponse) {
            return {
                code,
                type: code === "200" ?
                    response.schema ?
                        mapType(response.schema, data) :
                        null :
                    { type: "void", isArray: false, isCustomType: false }
            };
        }

        static getEndpointParameter(param: ISwaggerApiResponseEndpointParameter, data: ISwaggerApiResponse) {
            return {
                name: param.name,
                in: param.in,
                required: param.required,
                type: mapType(param.schema ? param.schema : param as any, data)
            };
        }

        static getEndpointMethod(method: string, endpoint: ISwaggerApiResponseEndpoint, data: ISwaggerApiResponse): IMethod {
            const getMethodName = (id: string) => {
                const segments = id.split("_");
                return segments[segments.length - 1];
            };

            return {
                method,
                name: getMethodName(endpoint.operationId),
                tags: endpoint.tags,
                parameters: (endpoint.parameters || []).map(p => this.getEndpointParameter(p, data)),
                responses: Object.keys(endpoint.responses).map(r => this.getEndpointMethodResponse(r, endpoint.responses[r], data))
            } as any;
        }

        static getEndpoint(path: string, pathData: ISwaggerApiResponsePath, data: ISwaggerApiResponse) {
            const methods = Object
                .keys(pathData)
                .map(p => this.getEndpointMethod(p, pathData[p], data));

            return {
                path,
                methods,
                group: methods[0].tags[0]
            };
        }

        static getEndpoints(data: ISwaggerApiResponse): IEndpoint[] {
            return Object
                .keys(data.paths)
                .map(k => this.getEndpoint(k, data.paths[k], data));
        }

    }

    export class Parser implements IParser {

        parse(response: {}): IParseResult {
            const responseObj = response as ISwaggerApiResponse;
            const models = ModelParser.getModels(responseObj);
            const endpoints = EndpointParser.getEndpoints(responseObj);

            return {
                models,
                endpoints
            };
        }

    }

}

export default Swagger.Parser;