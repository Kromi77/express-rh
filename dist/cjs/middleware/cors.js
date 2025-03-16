"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const JSONParserMiddleware = {
    name: "CORS",
    global: true,
    callback: (0, cors_1.default)({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
        allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
        credentials: true,
        optionsSuccessStatus: 200
    })
};
exports.default = JSONParserMiddleware;
//# sourceMappingURL=cors.js.map