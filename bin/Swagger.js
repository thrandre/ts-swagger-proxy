"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _Utils = require("./Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Swagger;
(function (Swagger) {
    function mapType(definedType, data) {
        var builtins = {
            "number": true,
            "string": true,
            "boolean": true,
            "any": true,
            "object": true
        };
        var defaultTypeConversionMap = {
            "integer": "number",
            "bool": "boolean",
            "object": "any",
            "Object": "any"
        };
        var convert = function convert(type) {
            return defaultTypeConversionMap[type] ? defaultTypeConversionMap[type] : type;
        };
        var toTypeInfo = function toTypeInfo(type, isArray) {
            return {
                type: type,
                isArray: isArray,
                isCustomType: !builtins[type]
            };
        };
        if (definedType.$ref) {
            return toTypeInfo(convert((0, _Utils.resolveJsonRef)(data, definedType.$ref)[0]), false);
        }
        if (definedType.type === "array") {
            return toTypeInfo(mapType(definedType.items, data).type, true);
        }
        return toTypeInfo(convert(definedType.type), false);
    }

    var ModelParser = function () {
        function ModelParser() {
            (0, _classCallCheck3.default)(this, ModelParser);
        }

        (0, _createClass3.default)(ModelParser, null, [{
            key: "getModelProperty",
            value: function getModelProperty(name, propertyDefinition, data) {
                return {
                    name: name,
                    type: mapType(propertyDefinition, data)
                };
            }
        }, {
            key: "getModelProperties",
            value: function getModelProperties(properties, data) {
                var _this = this;

                return (0, _keys2.default)(properties).map(function (k) {
                    return _this.getModelProperty(k, properties[k], data);
                });
            }
        }, {
            key: "getModel",
            value: function getModel(name, typeDefinition, data) {
                return {
                    name: typeDefinition.enum ? name + "Type" : name,
                    properties: this.getModelProperties(typeDefinition.properties, data),
                    enum: typeDefinition.enum
                };
            }
        }, {
            key: "getModels",
            value: function getModels(data) {
                var _this2 = this;

                return (0, _keys2.default)(data.definitions).map(function (k) {
                    return _this2.getModel(k, data.definitions[k], data);
                }).filter(function (m) {
                    return m.name !== "Object";
                });
            }
        }]);
        return ModelParser;
    }();

    var EndpointParser = function () {
        function EndpointParser() {
            (0, _classCallCheck3.default)(this, EndpointParser);
        }

        (0, _createClass3.default)(EndpointParser, null, [{
            key: "getEndpointMethodResponse",
            value: function getEndpointMethodResponse(code, response, data) {
                return {
                    code: code,
                    type: code === "200" ? response.schema ? mapType(response.schema, data) : null : { type: "void", isArray: false, isCustomType: false }
                };
            }
        }, {
            key: "getEndpointParameter",
            value: function getEndpointParameter(param, data) {
                return {
                    name: param.name,
                    in: param.in,
                    required: param.required,
                    type: mapType(param.schema ? param.schema : param, data)
                };
            }
        }, {
            key: "getEndpointMethod",
            value: function getEndpointMethod(method, endpoint, data) {
                var _this3 = this;

                var getMethodName = function getMethodName(id) {
                    var segments = id.split("_");
                    return segments[segments.length - 1];
                };
                return {
                    method: method,
                    name: getMethodName(endpoint.operationId),
                    tags: endpoint.tags,
                    parameters: (endpoint.parameters || []).map(function (p) {
                        return _this3.getEndpointParameter(p, data);
                    }),
                    responses: (0, _keys2.default)(endpoint.responses).map(function (r) {
                        return _this3.getEndpointMethodResponse(r, endpoint.responses[r], data);
                    })
                };
            }
        }, {
            key: "getEndpoint",
            value: function getEndpoint(path, pathData, data) {
                var _this4 = this;

                var methods = (0, _keys2.default)(pathData).map(function (p) {
                    return _this4.getEndpointMethod(p, pathData[p], data);
                });
                return {
                    path: path,
                    methods: methods,
                    group: methods[0].tags[0]
                };
            }
        }, {
            key: "getEndpoints",
            value: function getEndpoints(data) {
                var _this5 = this;

                return (0, _keys2.default)(data.paths).map(function (k) {
                    return _this5.getEndpoint(k, data.paths[k], data);
                });
            }
        }]);
        return EndpointParser;
    }();

    var Parser = function () {
        function Parser() {
            (0, _classCallCheck3.default)(this, Parser);
        }

        (0, _createClass3.default)(Parser, [{
            key: "parse",
            value: function parse(response) {
                var responseObj = response;
                var models = ModelParser.getModels(responseObj);
                var endpoints = EndpointParser.getEndpoints(responseObj);
                return {
                    models: models,
                    endpoints: endpoints
                };
            }
        }]);
        return Parser;
    }();

    Swagger.Parser = Parser;
})(Swagger || (Swagger = {}));
exports.default = Swagger.Parser;