import { IEndpoint, IModel } from "./Metadata";

export interface IParser {
    parse(response: {}): IParseResult;
}

export interface IParseResult {
    models: IModel[];
    endpoints: IEndpoint[];
}