import express from 'express';
import fs from 'fs';
import pc from 'picocolors';
import type { TExpressApp } from '../types/TExpressApp';

/**
 * Initialize static folders
 * @param staticFolders 
 * @param basePath 
 * @param app @type {TExpressApp}
 */
export function initStaticFolders(staticFolders: string[], basePath: string, app: TExpressApp) {
    if (staticFolders.length == 0) return
    for (const folder of staticFolders) {
        if (!fs.existsSync(folder)) continue;
        app.use(basePath, express.static(folder));
        console.log(`Registered > ${pc.bgGreen("Static Folder")} ${basePath}`);
        }
}