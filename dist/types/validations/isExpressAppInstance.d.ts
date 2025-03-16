import type { Application } from 'express';
export default function isExpressAppInstance(app: unknown): app is Application;
