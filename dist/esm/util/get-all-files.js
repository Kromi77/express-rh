"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAllFiles;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function getAllFiles(dir) {
    if (!fs_1.default.existsSync(dir))
        return [];
    const files = [];
    const routes = fs_1.default.readdirSync(dir);
    for (const route of routes) {
        const routePath = path_1.default.join(dir, route);
        if (fs_1.default.statSync(path_1.default.join(dir, route)).isDirectory()) {
            files.push(...await getAllFiles(path_1.default.join(dir, route)));
        }
        else if (route.endsWith(".js") || route.endsWith(".ts")) {
            files.push({
                path: routePath,
                file: await import(routePath)
            });
        }
    }
    return files;
}
