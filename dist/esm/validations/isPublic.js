"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isPublic = () => {
    const args = process.argv.slice(2);
    if (args.includes('--public') || args.includes('-p') || args.includes('--host') || args.includes('-h')) {
        return true;
    }
    return false;
};
exports.default = isPublic;
