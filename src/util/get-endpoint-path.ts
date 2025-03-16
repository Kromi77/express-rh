import path from 'path'
/**
 * 
 * @param useParentPath - Whether to use Parents Directory as the base path of endpoints
 * @param endpointsFolder - Folder containing the endpoints 
 * @param file - File that contains the endpoint
 * @param baseRoute - Base route for the endpoints
 * @returns 
 */
const getEndpointPath = (useParentPath: boolean, endpointsFolder: string, file: string, baseRoute: string = "/") => { 
    const routeLink = path.relative(endpointsFolder, file);
    const parts = routeLink.split(path.sep);
    const method = parts[0];
    let endpoint = "/"
    if (useParentPath) {
        endpoint += parts
            .slice(1)
            .join("/")
            .replace(/\.[jt]s$/, "")
            .replace(/\\/g, "/")
            .replace("[", ":")
            .replace("]", "")
            .replaceAll('.', '/');
    } else {
        endpoint = baseRoute + path.basename(file)
            .replace(/\.[jt]s$/, "")
            .replace("[", ":")
            .replace("]", "")
            .replaceAll('.', '/');
    }
    return { method, endpoint }
}

export default getEndpointPath;