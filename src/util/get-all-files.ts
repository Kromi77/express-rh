import fs from "fs";
import path from "path";

export default async function getAllFiles(dir: string): Promise<any[]> {
    if (!fs.existsSync(dir)) return [];

    const files = [];

    const routes = fs.readdirSync(dir);
    for (const route of routes) {
        const routePath = path.join(dir, route);
        if (fs.statSync(path.join(dir, route)).isDirectory()) {
            files.push(...await getAllFiles(path.join(dir, route)));
        } else if (route.endsWith(".js") || route.endsWith(".ts")) {
            files.push(
                {
                    path: routePath,
                    file: await import(routePath)
                });
        }
    }
    return files;
}