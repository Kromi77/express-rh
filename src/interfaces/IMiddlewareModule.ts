import type { NextFunction, Request, Response } from "express";

export interface IMiddlewareModule {
    name?: string;
    global?: boolean;
    matcher?: string[];
    ignore?: boolean;
    callback: (req: Request, res: Response, next: NextFunction) => void;
}