import type { Server } from 'http';
import type { TExpressApp } from '../types/TExpressApp';
export interface IHandlerOptions {
    /**
     * Express app instance
     * @type {TExpressApp}
     */
    app: TExpressApp;
    /**
     * Folder containing endpoint functions
     * Structure of the folder should be
     * @example:
     * routesFolder
     * ├─ GET - It describes the method of the endpoint it can be also called in lowercase like: "get"
     * │  ├─ user.ts - File containing the endpoint function
     * │  └─ comments.ts
     * └─ POST
     *    ├─ login.ts
     *    └─ register.ts
     *
     * @type {string}
     */
    endpointsFolder: string;
    /**
     * Host to listen on
     * @type {string}
     * @default localhost
     */
    host?: string;
    /**
     * Port to listen on
     * @type {number}
     * @default 3000
     */
    port?: number;
    /**
     * Default route to be used before the endpoint route
     * @example /api/v1/
     * @type {string}
     * @default /
     */
    baseRoute?: string;
    /**
     * Whether to enable development mode
     * @default false
     * @type {boolean}
     */
    devMode?: boolean;
    devModeRoute?: string;
    /**
     * Whether to use the parent path for the child routes
     * e.g for folder structure GET/comments/user path will be /comments/user
     * @default true
     * @type {boolean}
     * @description Logs all requests to the console
     * @example GET [17/05/2024 16:44:52]: /api/v1/user/5 Unknown Origin
     */
    useBuiltInLogger?: boolean;
    /**
     * Whether to use the built-in rate limiter
     * @default true
     * @type {boolean}
     * @description Rate limiter is set to 100 requests per 15 minutes
     */
    useBuiltInRateLimiter?: boolean;
    /**
     * Whether to use the built-in CORS middleware
     * @default true
     * @type {boolean}
     * @description CORS is set to allow all origins
     */
    useBuiltInCors?: boolean;
    /**
     * Whether to use the built-in JSON parser
     * @default true
     * @type {boolean}
     * @description JSON parser is set to the express built-in JSON parser
     */
    useBuiltInJsonParser?: boolean;
    /**
     * Whether to use the built-in URL encoded parser
     * @default true
     * @type {boolean}
     * @description URL encoded parser is set to the express built-in URL encoded parser
     */
    useBuiltInUrlEncodedParser?: boolean;
    /**
     * Whether to use Parents Directory as the base path of endpoints
     * @default false
     * @type {boolean}
     * @description If set to true, the base path of the endpoints will be the parent directory of the routes folder
     * @example routesFolder = /home/usr/project/src/routes
     */
    useParentPath?: boolean;
    /**
     * Folder containing middleware functions
     * @type {string}
     */
    middlewareFolder?: string;
    /**
     * Array of static folders to serve
     * @type {string[]}
     */
    staticFolders?: string[];
    /**
     * Base path for static files
     * @type {string}
     * @description If set, the static files will be served from this path
     * @default /static
     * @example /static/file.txt
     */
    staticBasePath?: string;
    /**
     * Callback function to be called when the server starts listening
     * @type {void}
     * @param {Server} server
     * @description This function is called when the server starts listening
     * @example (server) => console.log("Server started")
     * @default "Server listen on http://localhost:3000"
     * @returns {void}
     */
    startCallback?: (server?: Server) => void;
}
