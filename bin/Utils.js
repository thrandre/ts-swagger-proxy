"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupBy = groupBy;
exports.unique = unique;
exports.mapMany = mapMany;
exports.resolveJsonRef = resolveJsonRef;

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function groupBy(arr, keySelector) {
    keySelector = keySelector || function (e) {
        return e.toString();
    };
    return arr.reduce(function (p, n) {
        var key = keySelector(n);
        var arrOfArr = p[key] || (p[key] = []);
        arrOfArr.push(n);
        return p;
    }, {});
}
function unique(arr, keySelector) {
    keySelector = keySelector || function (e) {
        return e.toString();
    };
    var groups = groupBy(arr, keySelector);
    return (0, _keys2.default)(groups).map(function (k) {
        return groups[k][0];
    });
}
function mapMany(arr, selector) {
    return arr.map(selector).reduce(function (prev, next) {
        return prev.concat(next);
    }, []);
}
function resolveJsonRef(root, ref) {
    var allPathSegments = ref.split("/");
    var pathSegments = allPathSegments[0] === "#" ? allPathSegments.slice(1) : allPathSegments;
    return [pathSegments[pathSegments.length - 1], pathSegments.reduce(function (prev, next) {
        return prev[next];
    }, root)];
}