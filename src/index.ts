const version = "0.0.1-alpha.1";
import fs from "fs";
import pc from "picocolors";

import getPublicIP from "./util/get-public-ip";
import isPublic from "./validations/isPublic";

import { initEndpoints } from "./config/endpoints";
import { initMiddlewares } from "./config/middleware";
import { initStaticFolders } from "./config/static";

import type { IHandlerOptions } from "./interfaces/IHandlerOptions";
import type { TMiddlewareObject } from "./types/TMiddlewareObject";
import type { TExpressApp } from "./types/TExpressApp";
import type { Server } from "http";
import type { AddressInfo } from "net";
import type { IBuiltInMiddleware } from "./interfaces/IBuiltInMiddleware";
import isExpressAppInstance from "./validations/isExpressAppInstance";

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
	public app: TExpressApp;
	private _host: string;
	private _port: number;
	private _endpointsFolder: string;
	private _baseRoute: string = "/";
	private _devMode: boolean = false;
	private _devModeRoute: string = "/dev";
	private _useParentPath: boolean = false;
	private _releaseMode: boolean = false;
	private _middlewareFolder: string;
	private _staticFolders: string[];
	private _staticBasePath: string = "/static";
	private _startCallback: (server?: Server) => void;
	private _useBuiltInLogger: boolean;
	private _useBuiltInRateLimiter: boolean;
	private _useBuiltInCors: boolean;
	private _useBuiltInJsonParser: boolean;
	private _useBuiltInUrlEncodedParser: boolean;
	private _startTime: number
	private _expressVersion: string
	static middlewares: TMiddlewareObject = {
		base: [],
		global: [],
		route: [],
		other: [],
	};
	static buildInMiddlewares: IBuiltInMiddleware = {
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
	constructor(options: IHandlerOptions) {
		this._startTime = performance.now();
		this.init(options);
	}

	private async init(options: IHandlerOptions) {
		const {
			app,
			host,
			port,
			endpointsFolder,
			baseRoute,
			devMode,
			devModeRoute,
			useParentPath,
			useBuiltInLogger,
			useBuiltInRateLimiter,
			useBuiltInCors,
			useBuiltInJsonParser,
			useBuiltInUrlEncodedParser,
			middlewareFolder,
			staticFolders,
			staticBasePath,
			startCallback,
		} = options;

		if (!isExpressAppInstance(app)) {
			throw new Error(pc.red("ERH > Express app instance is required\nDid you forget to pass express() as an argument?"));
		}
		
		if (!endpointsFolder || !fs.existsSync(endpointsFolder)) {
			throw new Error(pc.red("ERH > Endpoints folder is required"));
		}

		this._expressVersion = await import("express/package.json").then((pkg) => pkg.default.version);
		this.app = app;
		this._endpointsFolder = endpointsFolder;
		
		if (baseRoute) this._baseRoute = baseRoute;
		if (devMode) this._devMode = devMode;
		if (devModeRoute) this._devModeRoute = devModeRoute;
		
		this._host = host ?? "localhost";
		this._port = port ?? 3000;

		if (useParentPath && this._baseRoute != "/") throw new Error(pc.red("ERH > You can't use parent path with base route"));
		
		this._useParentPath = useParentPath ?? false;
		
		if (staticBasePath) this._staticBasePath = staticBasePath;
		
		this._staticFolders = staticFolders ?? [];

		// Build-in middlewares
		this._useBuiltInLogger = useBuiltInLogger ?? true;
		this._useBuiltInRateLimiter = useBuiltInRateLimiter ?? true;
		this._useBuiltInCors = useBuiltInCors ?? true;
		this._useBuiltInJsonParser = useBuiltInJsonParser ?? true;
		this._useBuiltInUrlEncodedParser = useBuiltInUrlEncodedParser ?? true;
		this._releaseMode = isPublic();

        if (this._releaseMode) {
			console.log(`${pc.bgBlue("Info")} > Public release mode`);
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

		if (middlewareFolder && fs.existsSync(middlewareFolder)) {
			this._middlewareFolder = middlewareFolder;
        }
        
        await initMiddlewares(this.app, this._middlewareFolder);
		initStaticFolders(this._staticFolders, this._staticBasePath, this.app);
		initEndpoints(
			this.app,
			this._endpointsFolder,
			this._useParentPath,
			this._baseRoute,
			this._devMode,
			this._devModeRoute
		);

		if (typeof startCallback === "function") {
			this._startCallback = startCallback;
		}

		this.start();
	}


	static getMiddlewareStatus(name: string): { active: boolean; name: string } {
		return Object.values(ERH.buildInMiddlewares).filter(
			(middleware) => middleware.name === name
		)[0];
	}

	static setMiddlewareStatus(name: string, isActive: boolean) {
		if (ERH.buildInMiddlewares[name]) {
			ERH.buildInMiddlewares[name].active = isActive;
			return;
		}	
		console.error(`ERH ${pc.bgRed("Error")} > Middleware with name "${name}" does not exist.`);
	}


	private async start() {
		if (typeof this._startCallback === "function") {
			const server = this.app.listen(this._port, this._host, () => this._baseCallback(server, this._startCallback));
			return;
		}

		if (this._releaseMode) {
			this._runPublic(this._devMode);
			return
		}

		this._runDev();
	}

	private _baseCallback(server?: Server, callback?: (server?: Server) => void) {
		console.log(pc.green(`Express Routes Handler v${version} with express pkg v${this._expressVersion}`));
		console.log(`Server started in ${pc.green((performance.now() - this._startTime).toFixed(2))}ms`);
		if (callback) callback(server);
	}

	private _releaseCallback(server: Server, devMode: boolean) {
		this._baseCallback();
		const serverAddress = server.address() as AddressInfo;
		console.log(`${pc.green(pc.bold("Network"))}: http://${serverAddress.address}:${serverAddress.port}`);
		if (devMode) {
			this._runDev(true);
		}	
	}

	private _devCallback(server: Server, withRelease: boolean) {
		if (!withRelease) this._baseCallback();
		const serverAddress = server.address() as AddressInfo;
		console.log(`${pc.blue(pc.bold("Development"))}: http://localhost:${serverAddress.port}`);
	}

	private _runPublic(devMode: boolean) {
		const publicIP = getPublicIP();
			const releaseServer = this.app.listen(this._port, publicIP, () => {
				this._releaseCallback(releaseServer, devMode);
			})
	}

	private _runDev(withRelease = false) {
		let devServer: Server;
			try {
				devServer = this.app.listen(8080, () => {
					this._devCallback(devServer, withRelease);
				});
			} catch (e) {
				devServer = this.app.listen(0, () => {
					this._devCallback(devServer, withRelease);
				});
			}
	}
	
	
}

export default ERH;
export { ERH };
/**
 * 2024 (c) Routes Handler
 * Author: Michał Krok
 * Contact: michal.krok.go@outlook.com | Github: Kromi77
*/
