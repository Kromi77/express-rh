import type { IMiddlewareModule } from '../interfaces/IMiddlewareModule';
export type TMiddlewareObject = {
    global: IMiddlewareModule[];
    base: IMiddlewareModule[];
    route: IMiddlewareModule[];
    other: IMiddlewareModule[];
};
