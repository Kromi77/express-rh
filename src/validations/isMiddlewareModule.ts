import type { IMiddlewareModule } from "../interfaces/IMiddlewareModule";

export default function isMiddlewareModule(object: any): object is IMiddlewareModule {
    return typeof object === 'object' && object !== null && 'callback' in object && typeof object.callback === 'function';
}
