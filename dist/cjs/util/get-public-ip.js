"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPublicIP;
const os_1 = require("os");
function getPublicIP() {
    const NetworkInterfaces = (0, os_1.networkInterfaces)();
    let publicIp = null;
    Object.keys(NetworkInterfaces).forEach(interfaceName => {
        NetworkInterfaces[interfaceName].forEach(ipData => {
            if (!ipData.internal && ipData.family === 'IPv4') {
                publicIp = ipData.address;
            }
        });
    });
    return String(publicIp);
}
//# sourceMappingURL=get-public-ip.js.map