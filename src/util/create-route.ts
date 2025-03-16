import pc from "picocolors";
import type { RequestHandler } from "express";
import type { TExpressApp } from "../types/TExpressApp";
import getLogColor from "./get-log-color";
function logRegistered(type: string, routePath: string) {
    console.log(`Registered > ${getLogColor(type)} ${routePath}`);
}
export function createRoute(
    app: TExpressApp,
    type: string,
    routePath: string,
    callback: RequestHandler,
    middlewares: RequestHandler[]
) {
    middlewares.push(callback);
    type = type.toUpperCase();
    switch (type) {
        case "GET":
            app.get(routePath, ...middlewares);
            logRegistered(type, routePath);
            break;
        case "POST":
            app.post(routePath, ...middlewares);
            logRegistered(type, routePath);
            break;
        case "PUT":
            app.put(routePath, ...middlewares);
            logRegistered(type, routePath);
            break;
        case "DELETE":
            app.delete(routePath, ...middlewares);
            logRegistered(type, routePath);
            break;
        case "PATCH":
            app.patch(routePath, ...middlewares);
            logRegistered(type, routePath);
            break;
        case "OPTIONS":
            app.options(routePath, ...middlewares);
            logRegistered(type, routePath);
            break;
        case "HEAD":
            app.head(routePath, ...middlewares);
            logRegistered(type, routePath);
            break;
        case "ALL":
            app.all(routePath, ...middlewares);
            logRegistered(type, routePath);
            break;
        default:
            console.log(
                `${pc.bgYellow("Warning")} > Invalid Method ${type} on ${routePath}`
            );
            break;
    }
}