import type { TExpressApp } from '../types/TExpressApp';
export declare function initEndpoints(app: TExpressApp, endpointsFolder: string, useParentPath: boolean, baseRoute: string, devMode: boolean, devModeRoute: string): Promise<void>;
export declare function loadEndpoints(app: TExpressApp, files: any[], useParentPath: boolean, endpointsFolder: string, baseRoute: string, devMode: boolean, devModeRoute: string): void;
