import type { IEndpointModule } from "../interfaces/IEndpointModule";

export default function isEndpointModule(module: IEndpointModule): boolean {
    if (!module) return false;
    if (!module.callback || typeof module.callback !== 'function')
        return false;
    return true;
}