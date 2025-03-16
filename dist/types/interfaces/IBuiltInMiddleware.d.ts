export interface IBuiltInMiddleware {
    [key: string]: {
        active: boolean;
        name: string;
    };
}
