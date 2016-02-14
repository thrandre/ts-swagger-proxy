import { ApiFactoryTypeInfo, ApiTypeInfo, ConfigureRequestTypeInfo, HttpOptionsTypeInfo, HttpRequestTypeInfo, HttpResponseTypeInfo } from "./Builtins";
import { IEndpointGroup, IModule, IModel, IMethod, IParameter, ITypeInfo, IDependencyMap } from "./Metadata";
import { mapMany } from "./Utils";

export const newline = (count: number = 1) => `\r\n`.repeat(count);
export const tab = (count: number = 1) => `\t`.repeat(count);
export const firstCharToLowerCase = (str: string) => str.substr(0, 1).toLowerCase() + str.substr(1);
export const firstCharToUpperCase = (str: string) => str.substr(0, 1).toUpperCase() + str.substr(1);

export interface IUnit {
    (level?: number): string;
}

export function expandTypeInfo(type: ITypeInfo) {
    return type.isArray ? `${type.type}[]` : type.type;
}

namespace Emitter {
    const getProxyName = (name: string) => firstCharToLowerCase(name + "Proxy");
    const getProxyMethodName = (name: string) => firstCharToLowerCase(name);

    export function $str(str: string): IUnit {
        return (level: number = 0) => tab(level) + str;
    }

    export function $block(children: IUnit[], level: number = 0, delimiter?: string): IUnit {
        delimiter = delimiter !== null && typeof delimiter !== "undefined" ?
            delimiter :
            newline();

        return () => children
            .filter(c => !!c)
            .map(c => c(level))
            .join(delimiter);
    }

    export function $import(aliases: string[], ref: string): IUnit {
        return () => `import { ${ aliases.join(", ") } } from "${ ref }";`;
    }
    
    export function $reexport(aliases: string[], ref: string): IUnit {
        return () => `export { ${ aliases.join(", ") } } from "${ ref }";`;
    }

    export function $module(children: IUnit[]): IUnit {
        return () => children.map(c => c()).filter(c => !!c).join(newline(2));
    }

    export function $model(model: IModel): IUnit {
        return $block([
            $str(`export interface ${model.name} {`),
            $block(model.properties.map(p => $str(`${p.name}: ${ expandTypeInfo(p.type) };`)), 1),
            $str(`}`)
        ]);
    }

    export function $proxyMethod(path: string, proxyMethod: IMethod, getModel: (type: ITypeInfo) => IModule, prependWith?: string, level: number = 0): IUnit {
        const sanitizeArgumentName = (argumentName: string) => argumentName.replace(/\./g, "_");

        const getMethodArguments = (method: IMethod) => method.parameters
            .map(p => `${sanitizeArgumentName(p.name)}${!p.required ? "?" : ""}: ${ expandTypeInfo(p.type) }`)
            .join(", ");

        const getMethodReturnType = (method: IMethod) => method.responses.length > 0 ?
            expandTypeInfo(method.responses[0].type) :
            "void";

        const transformMethodReturnType = (type: string) =>
            `Promise<${HttpResponseTypeInfo.type}<${type}>>`;

        const transformUriParamsInPath = (path: string) => path.replace(/\{(.*?)\}/g, "$${ $1 }");

        const mapMethod = (method: string, type: string) => ({
            get: `get<${type}>`,
            post: `post`,
            put: `put`,
            delete: `del`
        }[method]);

        const getActionKey = (method: IMethod) => `${method.tags[0]}_${method.name}`;

        const needsQueryBuilder = ((params: IParameter[]) => params.some(p => p.in === "query"))(proxyMethod.parameters);
        const needsBodyBuilder = ((params: IParameter[]) => params.some(p => p.in === "body"))(proxyMethod.parameters);
        const needsRequestBuilder = needsQueryBuilder || needsBodyBuilder;
        const getQueryParams = (params: IParameter[]) => {
            const queryParams = params.filter(p => p.in === "query");
            return `{ ${ queryParams.map(p => !!~p.name.indexOf(".") ? `"${ p.name }": ${ sanitizeArgumentName(p.name) }` : p.name).join(", ") } }`;
        };
        const getBodyParam = (params: IParameter[]) => params.find(p => p.in === "body").name;

        const args = getMethodArguments(proxyMethod);
        const returnType = getMethodReturnType(proxyMethod);
		
		const getShape = (type: ITypeInfo) => JSON.stringify(
			type.isCustomType ?
				getModel(type).model.properties.reduce((prev, next) => {
					prev[next.name] = null;
					return prev;
				}, {}) :
			{}
		);
		
		const getTypeAssertion = (param: IParameter) => {
			if(param.type.isArray) {
				return `isArray("${ param.name }", ${ param.name }, ${ !param.required }, "argument", ${ getShape(param.type) })`;
			}
			
			if(param.type.isCustomType) {
				return `hasShape("${ param.name }", ${ param.name }, ${ !param.required }, "argument", ${ getShape(param.type) })`;
			}
			
			return {
				number: (name, optional) => `isNumber("${ name }", ${ name }, ${ optional }, "argument")`,
				string: (name, optional) => `isString("${ name }", ${ name }, ${ optional }, "argument")`,
				boolean: (name, optional) => `isBoolean("${ name }", ${ name }, ${ optional }, "argument")`
			}[param.type.type](sanitizeArgumentName(param.name), !param.required);
		};
		
        return $block([
            $str([prependWith || "", `(${args}): ${transformMethodReturnType(returnType)} {`].join("")),
            proxyMethod.parameters.length > 0 && $block([
				$str(`assert(`),
				$block(
					proxyMethod.parameters.map(p => $str(getTypeAssertion(p))),
					level + 2, "," + newline()
				),
				$str(`)(m => console.warn(m));`)
			], level + 1),
			$block([
                $str(`const options: ${ HttpOptionsTypeInfo.type } = {`),
                $block([
                    $str(`actionKey: "${getActionKey(proxyMethod)}"`),
                    $str(`url: \`${transformUriParamsInPath(path)}\``),
                    $str(`emitPending: true`)
                ], level + 2, "," + newline()),
                $str(`};`),
                needsQueryBuilder && $str(`const query = ${getQueryParams(proxyMethod.parameters)};`),
                needsRequestBuilder && $str(`const buildRequest: ${ConfigureRequestTypeInfo.type} = req => req.${
                    [
                        needsQueryBuilder && `query(query)`,
                        needsBodyBuilder && `send(${ getBodyParam(proxyMethod.parameters) })`,
                        `;`
                    ]
                        .filter(p => !!p)
                        .join("")
                    }`),
            ], level + 1),
            $block([
                $str(`return api.${mapMethod(proxyMethod.method, returnType)}(${["options", needsRequestBuilder && "buildRequest"].filter(a => !!a).join(", ")});`)
            ], level + 1),
            $str(`}`)
        ], level);
    }

    export function $proxy(endpointGroup: IEndpointGroup, getModel: (type: ITypeInfo) => IModule): IUnit {
        return $block([
            $str(`export function ${ endpointGroup.name }(apiFactory: ${ ApiFactoryTypeInfo.type }) {`),
            $block([
                $str(`const api = apiFactory("${ endpointGroup.name }");`),
                $str(`return {`),
                $block(
                    mapMany(endpointGroup.endpoints, e => e.methods.map(m => ({ method: m, path: e.path })))
                        .map(e => $proxyMethod(e.path, e.method, getModel, firstCharToLowerCase(e.method.name), 2)),
                    1,
                    "," + newline()
                ),
                $str(`};`)
            ], 1),
            $str(`}`)
        ]);
    }
    
    export function $index(deps: IDependencyMap): IUnit {
        return $block(
            Object.keys(deps).map(d => $reexport(deps[d], d))
        );
    }
    
    export function $endpointIndex(endpointTypes: ITypeInfo[]): IUnit {
        return $block([
            $str(`export default function (apiFactory: ${ ApiFactoryTypeInfo.type }) {`),
            $block([
                $str(`return {`),
                $block(
                    endpointTypes
                        .filter(e => !e.isBuiltin)
                        .map(e => $str(`${ e.type }: ${ e.type }(apiFactory)`)), 
                    2, "," + newline()),
                $str(`};`)
            ], 1),
            $str(`}`)
        ]);
    }
    
}

export default Emitter;