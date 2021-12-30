import { BaseAction, IActionPayload } from '@framework/actions/BaseAction';
import { PageMiddlewareType } from '@framework/page/creator/PageCreator';
import { Dispatch } from 'react';
import { Store, AnyAction, Reducer } from 'redux';

export type AsyncReducerT = (state: any, action: AnyAction) => any | undefined;

export interface ReducerType {
    data: AsyncReducerT;
    meta?: (
        state: any,
        action: AnyAction
    ) => {
        parentPageId: string;
    }
}

export type asyncReducersType = Record<string, AsyncReducerT>;

export interface IBaseAppGlobalState {
    [k: string]: any;
}

export interface IAppStoreInterface<T, A> {
    addMiddleware: (middleware: PageMiddlewareType<A>) => void;
    resetMiddleware: () => void;
    removeMiddleware: (middleware: PageMiddlewareType<A>) => void;
    getStore: () => Store<T>;
    injectDynamicPageReducer: (key: string, reducer: (state: any, action: AnyAction) => any | undefined, parentKey?: string) => void;
    removeDynamicPageReducer: (pageId: string) => void;
    createReducer: (asyncReducers: asyncReducersType, key: string) => Reducer<T>;
}

export type IMiddlewareType<T> = (next: Dispatch<AnyAction>) => (action: BaseAction<T, IActionPayload>) => void;