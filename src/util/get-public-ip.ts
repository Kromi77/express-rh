import { networkInterfaces } from 'os'

export default function getPublicIP() {
    const NetworkInterfaces = networkInterfaces();
    let publicIp = null;
    Object.keys(NetworkInterfaces).forEach(interfaceName => {
        NetworkInterfaces[interfaceName]!.forEach(ipData => {
            if (!ipData.internal && ipData.family === 'IPv4') {
                publicIp = ipData.address;
            }
        });
    });

    return String(publicIp);
}