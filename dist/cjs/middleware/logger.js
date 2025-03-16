"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_log_color_1 = __importDefault(require("../util/get-log-color"));
const logger = {
    name: "Logger",
    global: true,
    callback: (req, res, next) => {
        const method = (0, get_log_color_1.default)(req.method);
        const date = new Date();
        const start = performance.now();
        next();
        res.once('finish', () => {
            var _a;
            const end = performance.now();
            const resTime = (end - start).toFixed(2);
            const time = `${(date.getUTCDate()).toString().padStart(2, '0')}/${(date.getMonth()).toString().padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
            const logMessage = `${method} [${time}]: ${req.path} ${(_a = req.headers.origin) !== null && _a !== void 0 ? _a : 'Unknown Origin'} ${resTime}ms`;
            console.log(logMessage);
        });
    }
};
exports.default = logger;
//# sourceMappingURL=logger.js.map