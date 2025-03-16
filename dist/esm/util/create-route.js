"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoute = createRoute;
const picocolors_1 = __importDefault(require("picocolors"));
const get_log_color_1 = __importDefault(require("./get-log-color"));
function logRegistered(type, routePath) {
    console.log(`Registered > ${(0, get_log_color_1.default)(type)} ${routePath}`);
}
function createRoute(app, type, routePath, callback, middlewares) {
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
            console.log(`${picocolors_1.default.bgYellow("Warning")} > Invalid Method ${type} on ${routePath}`);
            break;
    }
}
