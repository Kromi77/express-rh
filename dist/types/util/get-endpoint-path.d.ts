/**
 *
 * @param useParentPath - Whether to use Parents Directory as the base path of endpoints
 * @param endpointsFolder - Folder containing the endpoints
 * @param file - File that contains the endpoint
 * @param baseRoute - Base route for the endpoints
 * @returns
 */
declare const getEndpointPath: (useParentPath: boolean, endpointsFolder: string, file: string, baseRoute?: string) => {
    method: string;
    endpoint: string;
};
export default getEndpointPath;
