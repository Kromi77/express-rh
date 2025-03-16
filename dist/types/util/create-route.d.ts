import type { RequestHandler } from "express";
import type { TExpressApp } from "../types/TExpressApp";
export declare function createRoute(app: TExpressApp, type: string, routePath: string, callback: RequestHandler, middlewares: RequestHandler[]): void;
