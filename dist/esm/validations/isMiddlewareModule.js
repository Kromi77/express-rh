"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isMiddlewareModule;
function isMiddlewareModule(object) {
    return typeof object === 'object' && object !== null && 'callback' in object && typeof object.callback === 'function';
}
