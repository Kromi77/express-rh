import ExpressRoutesHandler from '..';
import isEndpointModule from '../validations/isEndpointModule';
import getAllFiles from '../util/get-all-files';
import getEndpointPath from '../util/get-endpoint-path';

import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

import { createRoute } from '../util/create-route';
import type { TExpressApp } from '../types/TExpressApp';
import type { RateLimitRequestHandler } from 'express-rate-limit';
import type { RequestHandler } from 'express';
import type { IMiddlewareModule } from '../interfaces/IMiddlewareModule';

export async function initEndpoints(
    app: TExpressApp,
    endpointsFolder: string,
    useParentPath: boolean,
    baseRoute: string,
    devMode: boolean = false,
    devModeRoute: string
) {
    const methods = fs.readdirSync(endpointsFolder);
    for (const method of methods) {
        const endpoints = await getAllFiles(
            path.join(endpointsFolder, method)
        );

        loadEndpoints(
            app,
            endpoints,
            useParentPath,
            endpointsFolder,
            baseRoute,
            devMode,
            devModeRoute
        );
    }
}

export function loadEndpoints(
    app: TExpressApp,
    files: any[],
    useParentPath: boolean,
    endpointsFolder: string,
    baseRoute: string,
    devMode: boolean = false,
    devModeRoute: string
) {
    for (const file of files) {
        const route = file.file.default;

        if (!isEndpointModule(route)) {
            console.log(
                `ERH ${pc.bgYellow("Warning")} > Invalid endpoint module ${file.path}`
            );
            continue;
        }

        let { method, endpoint } = getEndpointPath(
            useParentPath,
            endpointsFolder,
            file.path,
            baseRoute
        );

        // Overwrite the default endpoint route
        if (route.path != undefined) {
            endpoint = route.path;
            if (!endpoint.startsWith("/")) {
                endpoint = "/" + endpoint;
            }
        }

        // Get defined middlewares for the specific endpoint
        const endpointMiddlewares: (RequestHandler | RateLimitRequestHandler)[] = route.middlewares?.map((middleware: IMiddlewareModule) => middleware.callback) || [];
        
        // Add route specific middlewares
        for (const middleware of ExpressRoutesHandler.middlewares.route) {
            if (middleware.matcher instanceof RegExp) {
                // Check if the endpoint matches the regex
                if (middleware.matcher.test(endpoint)) {
                    endpointMiddlewares.push(middleware.callback);
                }
            } else if (typeof middleware.matcher === "string") {
                // Check if the endpoint starts with group matcher
                if (endpoint.startsWith(middleware.matcher)) {
                    endpointMiddlewares.push(middleware.callback);
                }
            }
        }

        // Create prod route
        createRoute(app, method, endpoint, route.callback, endpointMiddlewares);

        // Create dev route if dev mode is enabled
        if (devMode) {
            createRoute(
                app,
                method,
                `${devModeRoute}${endpoint}`,
                route.callback,
                route.middlewares || []
            );
        }
    }
}