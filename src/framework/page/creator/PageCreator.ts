import { BaseAction, IActionPayload } from "@framework/actions/BaseAction";
import { IBaseAppGlobalState } from "@framework/types/GlobalAppState";
import { IActionDispatcher } from "@framework/types/InitialTypes";
import { Dispatch } from "react";
import { AnyAction, Store } from "redux";
import BasePage from "../BasePage";
import { IBasePageCreatorProps, IReducer } from "../BasePageCreatorComponent";

export interface PageClass<P, T> {
    new (props: P & IActionDispatcher<T>): BasePage<P, any>;
}

export type PageMiddlewareType<T> = (store: Store<IBaseAppGlobalState, AnyAction>) => PageNextMiddlewareType<T>;

export type PageNextMiddlewareType<T> = (next: Dispatch<AnyAction>) => (action: BaseAction<T, IActionPayload>) => void;

export interface PageCreator<S, T> {
    getMiddlewareType(): string;
    getPageClass(props?: IBasePageCreatorProps<S,T>): PageClass<S, T>;
    getPageReducer(pageId: string, pageState?: S): IReducer<S>;
    getPageMiddleware?(): PageMiddlewareType<T> | undefined;
}