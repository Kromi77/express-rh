import cors from "cors";
import type { IMiddlewareModule } from "../interfaces/IMiddlewareModule";

const JSONParserMiddleware: IMiddlewareModule = {
    name: "CORS",
    global: true,
    callback: cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
        allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
        credentials: true,
        optionsSuccessStatus: 200
    })
}
export default JSONParserMiddleware;
