"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JSONParserMiddleware = {
    name: "JSON Parser",
    global: true,
    callback: express_1.default.json()
};
exports.default = JSONParserMiddleware;
//# sourceMappingURL=json-parser.js.map