"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const getEndpointPath = (useParentPath, endpointsFolder, file, baseRoute = "/") => {
    const routeLink = path_1.default.relative(endpointsFolder, file);
    const parts = routeLink.split(path_1.default.sep);
    const method = parts[0];
    let endpoint = "/";
    if (useParentPath) {
        endpoint += parts
            .slice(1)
            .join("/")
            .replace(/\.[jt]s$/, "")
            .replace(/\\/g, "/")
            .replace("[", ":")
            .replace("]", "")
            .replaceAll('.', '/');
    }
    else {
        endpoint = baseRoute + path_1.default.basename(file)
            .replace(/\.[jt]s$/, "")
            .replace("[", ":")
            .replace("]", "")
            .replaceAll('.', '/');
    }
    return { method, endpoint };
};
exports.default = getEndpointPath;
//# sourceMappingURL=get-endpoint-path.js.map