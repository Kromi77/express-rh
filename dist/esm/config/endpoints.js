"use strict";
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
async function initEndpoints(app, endpointsFolder, useParentPath, baseRoute, devMode = false, devModeRoute) {
    const methods = fs_1.default.readdirSync(endpointsFolder);
    for (const method of methods) {
        const endpoints = await (0, get_all_files_1.default)(path_1.default.join(endpointsFolder, method));
        loadEndpoints(app, endpoints, useParentPath, endpointsFolder, baseRoute, devMode, devModeRoute);
    }
}
function loadEndpoints(app, files, useParentPath, endpointsFolder, baseRoute, devMode = false, devModeRoute) {
    for (const file of files) {
        const route = file.file.default;
        if (!(0, isEndpointModule_1.default)(route)) {
            console.log(`ERH ${picocolors_1.default.bgYellow("Warning")} > Invalid endpoint module ${file.path}`);
            continue;
        }
        let { method, endpoint } = (0, get_endpoint_path_1.default)(useParentPath, endpointsFolder, file.path, baseRoute);
        // Overwrite the default endpoint route
        if (route.path != undefined) {
            endpoint = route.path;
            if (!endpoint.startsWith("/")) {
                endpoint = "/" + endpoint;
            }
        }
        // Get defined middlewares for the specific endpoint
        const endpointMiddlewares = route.middlewares?.map((middleware) => middleware.callback) || [];
        // Add route specific middlewares
        for (const middleware of __1.default.middlewares.route) {
            if (middleware.matcher instanceof RegExp) {
                // Check if the endpoint matches the regex
                if (middleware.matcher.test(endpoint)) {
                    endpointMiddlewares.push(middleware.callback);
                }
            }
            else if (typeof middleware.matcher === "string") {
                // Check if the endpoint starts with group matcher
                if (endpoint.startsWith(middleware.matcher)) {
                    endpointMiddlewares.push(middleware.callback);
                }
            }
        }
        // Create prod route
        (0, create_route_1.createRoute)(app, method, endpoint, route.callback, endpointMiddlewares);
        // Create dev route if dev mode is enabled
        if (devMode) {
            (0, create_route_1.createRoute)(app, method, `${devModeRoute}${endpoint}`, route.callback, route.middlewares || []);
        }
    }
}
