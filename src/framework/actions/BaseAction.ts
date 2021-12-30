import { Dispatch } from "react";
import { Action, AnyAction, Store } from "redux";
import { string } from "yargs";

export interface IActionPayload {}

export interface BaseAction<T, P extends IActionPayload> extends Action {
    readonly type: T;
    readonly payload?: P;
    readonly tracking?: any;
}

export interface ActionDispatcher<T, A extends BaseAction<T, IActionPayload>> {
    getActionMiddleware(): (api: Store) => (next: Dispatch<AnyAction>) => (action: A) => void;
}

export interface IPageActionPayload<T> {
    pageId: string;
    parentPageId?: string;
    actionDispatcher: BaseActionDispatcher;
    data?: T;
    tracker?: any;
}

export class PageActionPayload<T> implements IPageActionPayload<T> {
    public readonly pageId: string;
    public readonly parentPageId?: string;
    public readonly actionDispatcher: BaseActionDispatcher;
    public readonly data?: T;
    public readonly tracker?: any;
    public readonly tracking?: any;
    constructor(pageId: string, actionDispatcher: BaseActionDispatcher, data?: T, tracker?: any, parentPageId?: string, tracking?: any) {
        this.pageId = pageId;
        this.parentPageId = parentPageId;
        this.actionDispatcher = actionDispatcher;
        this.data = data;
        this.tracker = tracker;
        this.tracking = tracking;
    }
}

export function isBaseAction(object: any): boolean {
    return 'type' in object;
}
