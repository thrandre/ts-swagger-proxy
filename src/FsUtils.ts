import * as FS from "fs";

export function removeDirectory(path: string) {
    if (FS.existsSync(path)) {
        FS.readdirSync(path).forEach((file, index) => {
            var curPath = path + "/" + file;
            if (FS.lstatSync(curPath).isDirectory()) {
                removeDirectory(curPath);
            } else {
                FS.unlinkSync(curPath);
            }
        });
        FS.rmdirSync(path);
    }
};

export function ensureDirectoryExists(path: string) {
    if(FS.existsSync(path)) {
        return;
    }
    
    FS.mkdirSync(path);
}

export function ensureDirectoriesExists(...paths: string[]) {
    const slicedPaths = paths.slice();
    slicedPaths.sort((a, b) => a.length === b.length ? 0 : (b.length > a.length ? -1 : 1));
    slicedPaths.forEach(p => ensureDirectoryExists(p));
}