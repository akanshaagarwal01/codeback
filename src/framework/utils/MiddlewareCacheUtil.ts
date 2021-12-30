import { PageMiddlewareType } from "@framework/page/creator/PageCreator";

type MiddlewareType = {
    pageCount: number;
    middlware: PageMiddlewareType<any>;
}

export default class MiddlewareCacheUtil {
    private _middlewareMap: Map<string, MiddlewareType> = new Map<string, MiddlewareType>();

    public setMiddleware(key: string, mObj: MiddlewareType) {
        this._middlewareMap.set(key, mObj);
    }

    public getMiddleware(key: string): MiddlewareType | undefined {
        return this._middlewareMap.get(key);
    }

    public resetMiddleware(key: string) {
        this._middlewareMap.delete(key);
    }

    public clearMiddlewareCache() {
        this._middlewareMap.clear();
    }
}
