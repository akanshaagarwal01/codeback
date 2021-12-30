import { BaseAction, IActionPayload } from "@framework/actions/BaseAction";
import { PageMiddlewareType, PageNextMiddlewareType } from "@framework/page/creator/PageCreator";
import { asyncReducersType, IAppStoreInterface } from "@framework/types/GlobalAppState";
import { Dispatch } from "react";
import { AnyAction, applyMiddleware, combineReducers, compose, createStore, PreloadedState, Reducer, ReducersMapObject, Store } from "redux";

export default class AppStore<T, A> implements IAppStoreInterface<T, A> {
    private _store: Store<T,BaseAction<A, IActionPayload>>;
    private _staticReducers: Partial<ReducersMapObject<T>>;
    private _staticMiddlewares: PageMiddlewareType<A>[] = [];
    private _asyncReducers: asyncReducersType | undefined;
    private appliedDynamicMiddleware: PageNextMiddlewareType<A>[] = [];
    private appliedMiddlewareArr: PageMiddlewareType<A>[] = [];

    public constructor(state: PreloadedState<T>, staticReducers: Partial<ReducersMapObject<T>> = {}, staticMiddleware: PageMiddlewareType<A>) {
        this._staticReducers = staticReducers;
        this._staticMiddlewares.push(staticMiddleware);
        this._store = createStore<T, BaseAction<A, IActionPayload>, unknown, unknown>(this.createReducer({}), state, compose(applyMiddleware(this._enhancers, ...this._staticMiddlewares as any)));

    }

    private _enhancers = () => {
        return (next: Dispatch<AnyAction>) => (action: BaseAction<A, IActionPayload>) => {
            return compose<any>(...this.appliedDynamicMiddleware)(next)(action);
        }
    }

    public createReducer(asyncReducers: asyncReducersType | undefined, dynamicKey = 'page'): Reducer<T> {
        return combineReducers({
            [dynamicKey]: asyncReducers && Object.keys(asyncReducers).length > 0 ? combineReducers(asyncReducers) : {},
            ...this._staticReducers
        } as ReducersMapObject<T>);
    }

    public injectDynamicPageReducer(key: string, reducer: (state: any, action: AnyAction) => any, parentKey?: string) {
        this._asyncReducers = {
            ...this._asyncReducers,
            [key]: combineReducers({
                data: reducer,
                meta: (_: any, __: AnyAction) => {
                    return {
                        parentPageId: parentKey
                    }
                }
            })
        };
        this._store.replaceReducer(this.createReducer(this._asyncReducers, 'page'));
    }

    public removeDynamicPageReducer(pageId: string): void {
        const pageIdToBeDeleted = pageId;
        delete this._asyncReducers?.[pageIdToBeDeleted];
        this._store.replaceReducer(this.createReducer(this._asyncReducers, 'page'));
    }

    public addMiddleware(middleware: PageMiddlewareType<A>) {
        this.appliedMiddlewareArr.push(middleware);
    }

    public removeMiddleware(middleware: PageMiddlewareType<A>) {
        const index = this.appliedMiddlewareArr.findIndex((d) => d === (middleware as PageMiddlewareType<A>));
        if (index !== -1) {
            this.appliedDynamicMiddleware = this.appliedDynamicMiddleware.filter((_, mIndex) => mIndex !== index);
            this.appliedMiddlewareArr = this.appliedMiddlewareArr.filter((_, mIndex) => mIndex !== index);
        }
    };

    public resetMiddleware() {
        this.appliedMiddlewareArr = [];
        this.appliedDynamicMiddleware = [];
    };

    public getStore() {
        return this._store;
    };
}