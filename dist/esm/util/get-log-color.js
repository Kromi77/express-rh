"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const picocolors_1 = __importDefault(require("picocolors"));
const getLogColor = (method) => {
    switch (method) {
        case "GET":
            return picocolors_1.default.blueBright(method);
        case "POST":
            return picocolors_1.default.green(method);
        case "PUT":
            return picocolors_1.default.yellowBright(method);
        case "DELETE":
            return picocolors_1.default.red(method);
        case "PATCH":
            return picocolors_1.default.cyan(method);
        case "OPTIONS":
            return picocolors_1.default.blue(method);
        case "HEAD":
            return picocolors_1.default.magenta(method);
        case "ALL":
            return picocolors_1.default.cyanBright(method);
        default:
            return picocolors_1.default.white(method);
    }
};
exports.default = getLogColor;
