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
exports.initMiddlewares = initMiddlewares;
const __1 = __importDefault(require(".."));
const get_all_files_1 = __importDefault(require("../util/get-all-files"));
const picocolors_1 = __importDefault(require("picocolors"));
const path_1 = __importDefault(require("path"));
const isMiddlewareModule_1 = __importDefault(require("../validations/isMiddlewareModule"));
function initMiddlewares(app, middlewareFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultMiddlewares = yield (0, get_all_files_1.default)(path_1.default.join(__dirname, "..", "middleware"));
        loadDefaultMiddlewares(defaultMiddlewares);
        for (const middleware of __1.default.middlewares.base) {
            if (__1.default.getMiddlewareStatus(middleware.name).active) {
                app.use(middleware.callback);
                console.log(`Registered > ${picocolors_1.default.bgCyan("Built-In Middleware")} ${middleware.name}`);
            }
        }
        const customMiddlewares = yield (0, get_all_files_1.default)(middlewareFolder);
        if (customMiddlewares.length < 1)
            return;
        loadCustomMiddlewares(customMiddlewares);
        for (const middleware of __1.default.middlewares.global) {
            app.use(middleware.callback);
            console.log(`${picocolors_1.default.bgGreen("Registered")} > ${picocolors_1.default.bgCyan("MIDDLEWARE")} ${middleware.name}`);
        }
    });
}
function loadDefaultMiddlewares(middlewares) {
    for (const middleware of middlewares) {
        if (middleware.file.default) {
            __1.default.middlewares.base.push(middleware.file.default);
        }
    }
}
function loadCustomMiddlewares(middlewares) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const middleware of middlewares) {
            const middlewareObj = middleware.file.default;
            if ((0, isMiddlewareModule_1.default)(middlewareObj)) {
                if (middlewareObj.ignore)
                    continue;
                if (middlewareObj.global) {
                    __1.default.middlewares.global.push(middlewareObj);
                }
                if (middlewareObj.matcher) {
                    __1.default.middlewares.route.push(middlewareObj);
                }
            }
        }
    });
}
//# sourceMappingURL=middleware.js.map