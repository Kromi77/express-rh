import type { IMiddlewareModule } from "../interfaces/IMiddlewareModule";
import getLogColor from "../util/get-log-color";

const logger: IMiddlewareModule = {
    name: "Logger",
    global: true,
    callback: (req, res, next) => { 
        const method = getLogColor(req.method);
        const date = new Date()
        const start = performance.now();
        
        next();
        
        res.once('finish', () => {
            const end = performance.now();
            const resTime = (end - start).toFixed(2);
            const time = `${(date.getUTCDate()).toString().padStart(2, '0')}/${(date.getMonth()).toString().padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}:${String(date.getSeconds()).padStart(2,'0')}`
            const logMessage = `${method} [${time}]: ${req.path} ${req.headers.origin ?? 'Unknown Origin'} ${resTime}ms`;
            console.log(logMessage);
        })
    }
}
export default logger
