import type { Application } from 'express';

export default function isExpressAppInstance(app: unknown): app is Application {
    if (!app) return false;
    if (typeof (app as any).use !== 'function') return false;
    if (typeof (app as any).listen !== 'function') return false;
    return true;
}