"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMiddlewares = initMiddlewares;
const __1 = __importDefault(require(".."));
const get_all_files_1 = __importDefault(require("../util/get-all-files"));
const picocolors_1 = __importDefault(require("picocolors"));
const path_1 = __importDefault(require("path"));
const isMiddlewareModule_1 = __importDefault(require("../validations/isMiddlewareModule"));
async function initMiddlewares(app, middlewareFolder) {
    const defaultMiddlewares = await (0, get_all_files_1.default)(path_1.default.join(__dirname, "..", "middleware"));
    loadDefaultMiddlewares(defaultMiddlewares);
    // Register built-in middlewares
    for (const middleware of __1.default.middlewares.base) {
        if (__1.default.getMiddlewareStatus(middleware.name).active) {
            app.use(middleware.callback);
            console.log(`Registered > ${picocolors_1.default.bgCyan("Built-In Middleware")} ${middleware.name}`);
        }
    }
    const customMiddlewares = await (0, get_all_files_1.default)(middlewareFolder);
    // If no custom middlewares are found return
    if (customMiddlewares.length < 1)
        return;
    loadCustomMiddlewares(customMiddlewares);
    // Register custom global middlewares
    for (const middleware of __1.default.middlewares.global) {
        app.use(middleware.callback);
        console.log(`${picocolors_1.default.bgGreen("Registered")} > ${picocolors_1.default.bgCyan("MIDDLEWARE")} ${middleware.name}`);
    }
}
function loadDefaultMiddlewares(middlewares) {
    for (const middleware of middlewares) {
        if (middleware.file.default) {
            __1.default.middlewares.base.push(middleware.file.default);
        }
    }
}
async function loadCustomMiddlewares(middlewares) {
    for (const middleware of middlewares) {
        const middlewareObj = middleware.file.default;
        if ((0, isMiddlewareModule_1.default)(middlewareObj)) {
            // Ignore middleware if ignore flag is set to true
            if (middlewareObj.ignore)
                continue;
            // Check if the middleware is global if so add it to the global middlewares
            if (middlewareObj.global) {
                __1.default.middlewares.global.push(middlewareObj);
            }
            // Check if the middleware has a matcher if so add it to the route middlewares
            if (middlewareObj.matcher) {
                __1.default.middlewares.route.push(middlewareObj);
            }
        }
    }
}
