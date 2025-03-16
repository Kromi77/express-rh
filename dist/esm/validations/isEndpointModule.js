"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isEndpointModule;
function isEndpointModule(module) {
    if (!module)
        return false;
    if (!module.callback || typeof module.callback !== 'function')
        return false;
    return true;
}
