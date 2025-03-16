"use strict";
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
/**
 * Express Routes Handler
 * @class ERH
 * @description A simple and easy to use Routes Handler for Express.js
 *
 * @example ESM
 * ```typescript
 * import ERH from '@kromi77/express-rh';
 * import express from 'express'
 * import path from 'path'
 * const routes = new ERH({
 *      app: express(),
 *      endpointsFolder: path.join(__dirname, 'endpoints'),
 *      useParentPath: true,
 *      baseRoute: '/api/v1/'
 *   });
 * ```
 *
 * @example CJS
 * ```javascript
 * const { ERH } = require('@kromi77/express-rh');
 * // OR
 * // const ERH = require('@kromi77/express-rh').default;
 * const express = require('express');
 * const path = require('path');
 * const routes = new ERH({
 *      app: express(),
 *      endpointsFolder: path.join(__dirname, 'endpoints'),
 *      useParentPath: true,
 *      baseRoute: '/api/v1/'
 *   });
 * ```
 */
class ERH {
    app;
    _host;
    _port;
    _endpointsFolder;
    _baseRoute = "/";
    _devMode = false;
    _devModeRoute = "/dev";
    _useParentPath = false;
    _releaseMode = false;
    _middlewareFolder;
    _staticFolders;
    _staticBasePath = "/static";
    _startCallback;
    _useBuiltInLogger;
    _useBuiltInRateLimiter;
    _useBuiltInCors;
    _useBuiltInJsonParser;
    _useBuiltInUrlEncodedParser;
    _startTime;
    _expressVersion;
    static middlewares = {
        base: [],
        global: [],
        route: [],
        other: [],
    };
    static buildInMiddlewares = {
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
    constructor(options) {
        this._startTime = performance.now();
        this.init(options);
    }
    async init(options) {
        const { app, host, port, endpointsFolder, baseRoute, devMode, devModeRoute, useParentPath, useBuiltInLogger, useBuiltInRateLimiter, useBuiltInCors, useBuiltInJsonParser, useBuiltInUrlEncodedParser, middlewareFolder, staticFolders, staticBasePath, startCallback, } = options;
        if (!(0, isExpressAppInstance_1.default)(app)) {
            throw new Error(picocolors_1.default.red("ERH > Express app instance is required\nDid you forget to pass express() as an argument?"));
        }
        if (!endpointsFolder || !fs_1.default.existsSync(endpointsFolder)) {
            throw new Error(picocolors_1.default.red("ERH > Endpoints folder is required"));
        }
        this._expressVersion = await import("express/package.json").then((pkg) => pkg.default.version);
        this.app = app;
        this._endpointsFolder = endpointsFolder;
        if (baseRoute)
            this._baseRoute = baseRoute;
        if (devMode)
            this._devMode = devMode;
        if (devModeRoute)
            this._devModeRoute = devModeRoute;
        this._host = host ?? "localhost";
        this._port = port ?? 3000;
        this._useParentPath = useParentPath ?? false;
        if (staticBasePath)
            this._staticBasePath = staticBasePath;
        this._staticFolders = staticFolders ?? [];
        // Build-in middlewares
        this._useBuiltInLogger = useBuiltInLogger ?? true;
        this._useBuiltInRateLimiter = useBuiltInRateLimiter ?? true;
        this._useBuiltInCors = useBuiltInCors ?? true;
        this._useBuiltInJsonParser = useBuiltInJsonParser ?? true;
        this._useBuiltInUrlEncodedParser = useBuiltInUrlEncodedParser ?? true;
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
        await (0, middleware_1.initMiddlewares)(this.app, this._middlewareFolder);
        (0, static_1.initStaticFolders)(this._staticFolders, this._staticBasePath, this.app);
        (0, endpoints_1.initEndpoints)(this.app, this._endpointsFolder, this._useParentPath, this._baseRoute, this._devMode, this._devModeRoute);
        if (typeof startCallback === "function") {
            this._startCallback = startCallback;
        }
        this.start();
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
    async start() {
        if (typeof this._startCallback === "function") {
            const server = this.app.listen(this._port, this._host, () => this._baseCallback(server, this._startCallback));
            return;
        }
        if (this._releaseMode) {
            this._runPublic(this._devMode);
            return;
        }
        this._runDev();
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
exports.default = ERH;
/**
 * 2024 (c) Routes Handler
 * Author: Michał Krok
 * Contact: michal.krok.go@outlook.com | Github: Kromi77
*/
