import express from "express";
import type { IMiddlewareModule } from "../interfaces/IMiddlewareModule";

const JSONParserMiddleware: IMiddlewareModule = {
    name: "JSON Parser",
    global: true,
    callback: express.json()
}
export default JSONParserMiddleware;
