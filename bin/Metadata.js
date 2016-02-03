"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createTypeInfo = createTypeInfo;
var ModuleKind = exports.ModuleKind = undefined;
(function (ModuleKind) {
    ModuleKind[ModuleKind["Model"] = 0] = "Model";
    ModuleKind[ModuleKind["Proxy"] = 1] = "Proxy";
    ModuleKind[ModuleKind["Util"] = 2] = "Util";
    ModuleKind[ModuleKind["Index"] = 3] = "Index";
    ModuleKind[ModuleKind["EndpointIndex"] = 4] = "EndpointIndex";
})(ModuleKind || (exports.ModuleKind = ModuleKind = {}));
function createTypeInfo(type) {
    var isArray = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var isCustomType = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var isBuiltin = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    return {
        type: type,
        isArray: isArray,
        isCustomType: isCustomType,
        isBuiltin: isBuiltin
    };
}