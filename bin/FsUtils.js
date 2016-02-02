"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.removeDirectory = removeDirectory;
exports.ensureDirectoryExists = ensureDirectoryExists;
exports.ensureDirectoriesExists = ensureDirectoriesExists;

var _fs = require("fs");

var FS = _interopRequireWildcard(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function removeDirectory(path) {
    if (FS.existsSync(path)) {
        FS.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (FS.lstatSync(curPath).isDirectory()) {
                removeDirectory(curPath);
            } else {
                FS.unlinkSync(curPath);
            }
        });
        FS.rmdirSync(path);
    }
}
;
function ensureDirectoryExists(path) {
    if (FS.existsSync(path)) {
        return;
    }
    FS.mkdirSync(path);
}
function ensureDirectoriesExists() {
    for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
    }

    var slicedPaths = paths.slice();
    slicedPaths.sort(function (a, b) {
        return a.length === b.length ? 0 : b.length > a.length ? -1 : 1;
    });
    slicedPaths.forEach(function (p) {
        return ensureDirectoryExists(p);
    });
}