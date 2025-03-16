"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEndpoints = initEndpoints;
exports.loadEndpoints = loadEndpoints;
const __1 = __importDefault(require(".."));
const isEndpointModule_1 = __importDefault(require("../validations/isEndpointModule"));
const get_all_files_1 = __importDefault(require("../util/get-all-files"));
const get_endpoint_path_1 = __importDefault(require("../util/get-endpoint-path"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const picocolors_1 = __importDefault(require("picocolors"));
const create_route_1 = require("../util/create-route");
function initEndpoints(app_1, endpointsFolder_1, useParentPath_1, baseRoute_1) {
    return __awaiter(this, arguments, void 0, function* (app, endpointsFolder, useParentPath, baseRoute, devMode = false, devModeRoute) {
        const methods = fs_1.default.readdirSync(endpointsFolder);
        for (const method of methods) {
            const endpoints = yield (0, get_all_files_1.default)(path_1.default.join(endpointsFolder, method));
            loadEndpoints(app, endpoints, useParentPath, endpointsFolder, baseRoute, devMode, devModeRoute);
        }
    });
}
function loadEndpoints(app, files, useParentPath, endpointsFolder, baseRoute, devMode = false, devModeRoute) {
    var _a;
    for (const file of files) {
        const route = file.file.default;
        if (!(0, isEndpointModule_1.default)(route)) {
            console.log(`ERH ${picocolors_1.default.bgYellow("Warning")} > Invalid endpoint module ${file.path}`);
            continue;
        }
        let { method, endpoint } = (0, get_endpoint_path_1.default)(useParentPath, endpointsFolder, file.path, baseRoute);
        if (route.path != undefined) {
            endpoint = route.path;
            if (!endpoint.startsWith("/")) {
                endpoint = "/" + endpoint;
            }
        }
        const endpointMiddlewares = ((_a = route.middlewares) === null || _a === void 0 ? void 0 : _a.map((middleware) => middleware.callback)) || [];
        for (const middleware of __1.default.middlewares.route) {
            if (middleware.matcher instanceof RegExp) {
                if (middleware.matcher.test(endpoint)) {
                    endpointMiddlewares.push(middleware.callback);
                }
            }
            else if (typeof middleware.matcher === "string") {
                if (endpoint.startsWith(middleware.matcher)) {
                    endpointMiddlewares.push(middleware.callback);
                }
            }
        }
        (0, create_route_1.createRoute)(app, method, endpoint, route.callback, endpointMiddlewares);
        if (devMode) {
            (0, create_route_1.createRoute)(app, method, `${devModeRoute}${endpoint}`, route.callback, route.middlewares || []);
        }
    }
}
//# sourceMappingURL=endpoints.js.map