import express from "express";
import type { IMiddlewareModule } from "../interfaces/IMiddlewareModule";

const urlEncodedParserMiddleware: IMiddlewareModule = {
    name: "URL Encoded Parser",
    global: true,
    callback: express.urlencoded({ extended: true })
}
export default urlEncodedParserMiddleware;
