"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ERH = void 0;
const version = "0.0.1-alpha.1";
const fs_1 = __importDefault(require("fs"));
const picocolors_1 = __importDefault(require("picocolors"));
const get_public_ip_1 = __importDefault(require("./util/get-public-ip"));
const isPublic_1 = __importDefault(require("./validations/isPublic"));
const endpoints_1 = require("./config/endpoints");
const middleware_1 = require("./config/middleware");
const static_1 = require("./config/static");
const isExpressAppInstance_1 = __importDefault(require("./validations/isExpressAppInstance"));
class ERH {
    constructor(options) {
        this._baseRoute = "/";
        this._devMode = false;
        this._devModeRoute = "/dev";
        this._useParentPath = false;
        this._releaseMode = false;
        this._staticBasePath = "/static";
        this._startTime = performance.now();
        this.init(options);
    }
    init(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { app, host, port, endpointsFolder, baseRoute, devMode, devModeRoute, useParentPath, useBuiltInLogger, useBuiltInRateLimiter, useBuiltInCors, useBuiltInJsonParser, useBuiltInUrlEncodedParser, middlewareFolder, staticFolders, staticBasePath, startCallback, } = options;
            if (!(0, isExpressAppInstance_1.default)(app)) {
                throw new Error(picocolors_1.default.red("ERH > Express app instance is required\nDid you forget to pass express() as an argument?"));
            }
            if (!endpointsFolder || !fs_1.default.existsSync(endpointsFolder)) {
                throw new Error(picocolors_1.default.red("ERH > Endpoints folder is required"));
            }
            this._expressVersion = yield Promise.resolve().then(() => __importStar(require("express/package.json"))).then((pkg) => pkg.default.version);
            this.app = app;
            this._endpointsFolder = endpointsFolder;
            if (baseRoute)
                this._baseRoute = baseRoute;
            if (devMode)
                this._devMode = devMode;
            if (devModeRoute)
                this._devModeRoute = devModeRoute;
            this._host = host !== null && host !== void 0 ? host : "localhost";
            this._port = port !== null && port !== void 0 ? port : 3000;
            this._useParentPath = useParentPath !== null && useParentPath !== void 0 ? useParentPath : false;
            if (staticBasePath)
                this._staticBasePath = staticBasePath;
            this._staticFolders = staticFolders !== null && staticFolders !== void 0 ? staticFolders : [];
            this._useBuiltInLogger = useBuiltInLogger !== null && useBuiltInLogger !== void 0 ? useBuiltInLogger : true;
            this._useBuiltInRateLimiter = useBuiltInRateLimiter !== null && useBuiltInRateLimiter !== void 0 ? useBuiltInRateLimiter : true;
            this._useBuiltInCors = useBuiltInCors !== null && useBuiltInCors !== void 0 ? useBuiltInCors : true;
            this._useBuiltInJsonParser = useBuiltInJsonParser !== null && useBuiltInJsonParser !== void 0 ? useBuiltInJsonParser : true;
            this._useBuiltInUrlEncodedParser = useBuiltInUrlEncodedParser !== null && useBuiltInUrlEncodedParser !== void 0 ? useBuiltInUrlEncodedParser : true;
            this._releaseMode = (0, isPublic_1.default)();
            if (this._releaseMode) {
                console.log(`${picocolors_1.default.bgBlue("Info")} > Public release mode`);
            }
            if (this._useBuiltInLogger) {
                ERH.setMiddlewareStatus("logger", true);
            }
            if (this._useBuiltInRateLimiter) {
                ERH.setMiddlewareStatus("rateLimiter", true);
            }
            if (this._useBuiltInCors) {
                ERH.setMiddlewareStatus("cors", true);
            }
            if (this._useBuiltInJsonParser) {
                ERH.setMiddlewareStatus("jsonParser", true);
            }
            if (this._useBuiltInUrlEncodedParser) {
                ERH.setMiddlewareStatus("urlEncodedParser", true);
            }
            if (middlewareFolder && fs_1.default.existsSync(middlewareFolder)) {
                this._middlewareFolder = middlewareFolder;
            }
            yield (0, middleware_1.initMiddlewares)(this.app, this._middlewareFolder);
            (0, static_1.initStaticFolders)(this._staticFolders, this._staticBasePath, this.app);
            (0, endpoints_1.initEndpoints)(this.app, this._endpointsFolder, this._useParentPath, this._baseRoute, this._devMode, this._devModeRoute);
            if (typeof startCallback === "function") {
                this._startCallback = startCallback;
            }
            this.start();
        });
    }
    static getMiddlewareStatus(name) {
        return Object.values(ERH.buildInMiddlewares).filter((middleware) => middleware.name === name)[0];
    }
    static setMiddlewareStatus(name, isActive) {
        if (ERH.buildInMiddlewares[name]) {
            ERH.buildInMiddlewares[name].active = isActive;
            return;
        }
        console.error(`ERH ${picocolors_1.default.bgRed("Error")} > Middleware with name "${name}" does not exist.`);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this._startCallback === "function") {
                const server = this.app.listen(this._port, this._host, () => this._baseCallback(server, this._startCallback));
                return;
            }
            if (this._releaseMode) {
                this._runPublic(this._devMode);
                return;
            }
            this._runDev();
        });
    }
    _baseCallback(server, callback) {
        console.log(picocolors_1.default.green(`Express Routes Handler v${version} with express pkg v${this._expressVersion}`));
        console.log(`Server started in ${picocolors_1.default.green((performance.now() - this._startTime).toFixed(2))}ms`);
        if (callback)
            callback(server);
    }
    _releaseCallback(server, devMode) {
        this._baseCallback();
        const serverAddress = server.address();
        console.log(`${picocolors_1.default.green(picocolors_1.default.bold("Network"))}: http://${serverAddress.address}:${serverAddress.port}`);
        if (devMode) {
            this._runDev(true);
        }
    }
    _devCallback(server, withRelease) {
        if (!withRelease)
            this._baseCallback();
        const serverAddress = server.address();
        console.log(`${picocolors_1.default.blue(picocolors_1.default.bold("Development"))}: http://localhost:${serverAddress.port}`);
    }
    _runPublic(devMode) {
        const publicIP = (0, get_public_ip_1.default)();
        const releaseServer = this.app.listen(this._port, publicIP, () => {
            this._releaseCallback(releaseServer, devMode);
        });
    }
    _runDev(withRelease = false) {
        let devServer;
        try {
            devServer = this.app.listen(8080, () => {
                this._devCallback(devServer, withRelease);
            });
        }
        catch (e) {
            devServer = this.app.listen(0, () => {
                this._devCallback(devServer, withRelease);
            });
        }
    }
}
exports.ERH = ERH;
ERH.middlewares = {
    base: [],
    global: [],
    route: [],
    other: [],
};
ERH.buildInMiddlewares = {
    logger: {
        active: false,
        name: "Logger",
    },
    rateLimiter: {
        active: false,
        name: "Rate Limit",
    },
    cors: {
        active: false,
        name: "CORS",
    },
    jsonParser: {
        active: false,
        name: "JSON Parser",
    },
    urlEncodedParser: {
        active: false,
        name: "URL Encoded Parser",
    }
};
exports.default = ERH;
//# sourceMappingURL=index.js.map