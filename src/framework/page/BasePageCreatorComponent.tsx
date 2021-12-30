import { BaseAction, IActionPayload } from "@framework/actions/BaseAction";
import { Dispatch } from "react";
import { AnyAction, Store } from "redux";
import { PageMiddlewareType } from "./creator/PageCreator";

export type IReducer<S> = (state: S, action: AnyAction) => S | undefined;
export type IInjectPageReducer<S> = (key: string, reducer: IReducer<S>, parentKey?: string) => void;
export type IAddMiddleware<A> = (middleware?: (store: Store<any, AnyAction>) => (next: Dispatch<AnyAction>) => (action: BaseAction<A, IActionPayload>) => void | undefined) => void;
export type IRemoveMiddleware<A> = (middleware: PageMiddlewareType<A>) => void;

export interface IBasePageCreatorProps<S, A> {
    pageId: string;
    url: string;
    prevPageUrl?: string;
    deepLinkUrl: string;
    parentPageId?: string;
    injectPageReducer: IInjectPageReducer<S>;
    addMiddlware: IAddMiddleware<A>;
    removeMiddleware: IRemoveMiddleware<A>;
    removeDynamicPageReducer: (pageId: string) => void;
}