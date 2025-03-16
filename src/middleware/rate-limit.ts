import rateLimit from "express-rate-limit"
import type { IMiddlewareModule } from "../interfaces/IMiddlewareModule";

const rateLimitMiddleware: IMiddlewareModule = {
    name: "Rate Limit",
    global: true,
    callback: rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 100,
            standardHeaders: 'draft-7',
            legacyHeaders: false
        })
}
export default rateLimitMiddleware;
