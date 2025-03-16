import type { IHandlerOptions } from "./interfaces/IHandlerOptions";
import type { TMiddlewareObject } from "./types/TMiddlewareObject";
import type { TExpressApp } from "./types/TExpressApp";
import type { IBuiltInMiddleware } from "./interfaces/IBuiltInMiddleware";
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
declare class ERH {
    app: TExpressApp;
    private _host;
    private _port;
    private _endpointsFolder;
    private _baseRoute;
    private _devMode;
    private _devModeRoute;
    private _useParentPath;
    private _releaseMode;
    private _middlewareFolder;
    private _staticFolders;
    private _staticBasePath;
    private _startCallback;
    private _useBuiltInLogger;
    private _useBuiltInRateLimiter;
    private _useBuiltInCors;
    private _useBuiltInJsonParser;
    private _useBuiltInUrlEncodedParser;
    private _startTime;
    private _expressVersion;
    static middlewares: TMiddlewareObject;
    static buildInMiddlewares: IBuiltInMiddleware;
    constructor(options: IHandlerOptions);
    private init;
    static getMiddlewareStatus(name: string): {
        active: boolean;
        name: string;
    };
    static setMiddlewareStatus(name: string, isActive: boolean): void;
    private start;
    private _baseCallback;
    private _releaseCallback;
    private _devCallback;
    private _runPublic;
    private _runDev;
}
export default ERH;
export { ERH };
/**
 * 2024 (c) Routes Handler
 * Author: Michał Krok
 * Contact: michal.krok.go@outlook.com | Github: Kromi77
*/
