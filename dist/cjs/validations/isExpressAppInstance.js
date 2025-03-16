"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isExpressAppInstance;
function isExpressAppInstance(app) {
    if (!app)
        return false;
    if (typeof app.use !== 'function')
        return false;
    if (typeof app.listen !== 'function')
        return false;
    return true;
}
//# sourceMappingURL=isExpressAppInstance.js.map