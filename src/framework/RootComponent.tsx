import * as React from 'react';
import { AnyAction, PreloadedState, ReducersMapObject, Store } from 'redux';
import { BaseAction, IActionPayload } from './actions/BaseAction';
import { PageMiddlewareType } from './page/creator/PageCreator';
import AppStore from './store/initializeStore';

type InjectPageReducerType<T> = (key: string, reducer: (state: T, action: AnyAction) => any | undefined) => void;

export default abstract class RootComponent<T,A> extends React.Component<{} ,{}> {
    public _store: AppStore<T, A>;
    public _appStore: Store<T>;
    public contextOptions: {
        injectPageReducer: InjectPageReducerType<T>;
        addMiddleware: (middleware: PageMiddlewareType<any>) => void;
        actionDispatcher: (action: BaseAction<A, IActionPayload>) => void;
        removeMiddleware: (middleware: PageMiddlewareType<any>) => void;
        removeDynamicPageReducer: (pageId: string) => void;
    }

    public constructor(props: {}) {
        super(props);
        this._store = new AppStore<T,A>(this.getInitialComponentState(), this.getStaticReducers(), this.getStaticMiddleware())
        this._appStore = this._store.getStore();
        this.contextOptions = {
            injectPageReducer: this.injectPageReducer,
            addMiddleware: this.addMiddleware,
            removeDynamicPageReducer: this.removeDynamicPageReducer,
            removeMiddleware: this.removeMiddleware,
            actionDispatcher: this.forwardDispatch
        }
    }

    public abstract getInitialComponentState(): PreloadedState<T>;

    public abstract getStaticReducers(): Partial<ReducersMapObject<T>>;

    public abstract getStaticMiddleware(): PageMiddlewareType<A>;

    public injectPageReducer = (key: string, reducer: (state: any, action: AnyAction) => any | undefined, parentKey?: string) => {
        this._store.injectDynamicPageReducer(key, reducer, parentKey);
    }

    public addMiddleware = (mware: PageMiddlewareType<any>) => {
        this._store.addMiddleware(mware);
    }

    public removeMiddleware = (mware: PageMiddlewareType<any>) => {
        this._store.removeMiddleware(mware);
    }

    public removeDynamicPageReducer = (pageId: string) => {
        this._store.removeDynamicPageReducer(pageId);
    }

    public forwardDispatch = (action: BaseAction<A, IActionPayload>): void => {
        this._appStore.dispatch(action);
    }
}