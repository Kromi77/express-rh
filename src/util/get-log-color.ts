import pc from 'picocolors';

const getLogColor = (method: string): string => {
    switch (method) {
        case "GET":
            return pc.blueBright(method);
        case "POST":
            return pc.green(method);
        case "PUT":
            return pc.yellowBright(method);
        case "DELETE":
            return pc.red(method);
        case "PATCH":
            return pc.cyan(method);
        case "OPTIONS":
            return pc.blue(method);
        case "HEAD":
            return pc.magenta(method);
        case "ALL":
            return pc.cyanBright(method);
        default:
            return pc.white(method);
    }
};

export default getLogColor;
