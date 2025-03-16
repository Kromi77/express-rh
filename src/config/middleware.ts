import ExpressRoutesHandler from "..";
import getAllFiles from "../util/get-all-files";
import pc from "picocolors";
import path from "path";
import isMiddlewareModule from "../validations/isMiddlewareModule";
import type { TExpressApp } from "../types/TExpressApp";

export async function initMiddlewares(app: TExpressApp, middlewareFolder: string) {
    const defaultMiddlewares = await getAllFiles(
        path.join(__dirname, "..", "middleware")
    );
    loadDefaultMiddlewares(defaultMiddlewares);
    // Register built-in middlewares
    for (const middleware of ExpressRoutesHandler.middlewares.base) {
        if (ExpressRoutesHandler.getMiddlewareStatus(middleware.name!).active) {
            app.use(middleware.callback);
            console.log(
                `Registered > ${pc.bgCyan("Built-In Middleware")} ${
                    middleware.name
                }`
            );
        }
    }

    const customMiddlewares = await getAllFiles(middlewareFolder);
    
    // If no custom middlewares are found return
    if (customMiddlewares.length < 1) return;

    loadCustomMiddlewares(customMiddlewares);

    // Register custom global middlewares
    for (const middleware of ExpressRoutesHandler.middlewares.global) {
        app.use(middleware.callback);
        console.log(
            `${pc.bgGreen("Registered")} > ${pc.bgCyan("MIDDLEWARE")} ${
                middleware.name
            }`
        );
    }
}

function loadDefaultMiddlewares(middlewares: any[]) {
    for (const middleware of middlewares) {
        if (middleware.file.default) {
            ExpressRoutesHandler.middlewares.base.push(middleware.file.default);
        }
    }
}

async function loadCustomMiddlewares(middlewares: any[]) {
    for (const middleware of middlewares) {
        const middlewareObj = middleware.file.default;
        if (isMiddlewareModule(middlewareObj)) {
            // Ignore middleware if ignore flag is set to true
            if (middlewareObj.ignore) continue;

            // Check if the middleware is global if so add it to the global middlewares
            if (middlewareObj.global) {
                ExpressRoutesHandler.middlewares.global.push(middlewareObj);
            }
            // Check if the middleware has a matcher if so add it to the route middlewares
            if (middlewareObj.matcher) {
                ExpressRoutesHandler.middlewares.route.push(middlewareObj);
            }
        }
    }
}