"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStaticFolders = initStaticFolders;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const picocolors_1 = __importDefault(require("picocolors"));
/**
 * Initialize static folders
 * @param staticFolders
 * @param basePath
 * @param app @type {TExpressApp}
 */
function initStaticFolders(staticFolders, basePath, app) {
    if (staticFolders.length == 0)
        return;
    for (const folder of staticFolders) {
        if (!fs_1.default.existsSync(folder))
            continue;
        app.use(basePath, express_1.default.static(folder));
        console.log(`Registered > ${picocolors_1.default.bgGreen("Static Folder")} ${basePath}`);
    }
}
