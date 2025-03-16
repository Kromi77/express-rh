import type { Request, RequestHandler, Response } from "express";
import type { IMiddlewareModule } from "./IMiddlewareModule";
export interface IEndpointModule {
    /**
     * Override the default path of the endpoint and set a custom one
     * @default undefined
     */
    path?: string;

    middlewares?: IMiddlewareModule[];
    callback(req: Request, res: Response): RequestHandler;
}

