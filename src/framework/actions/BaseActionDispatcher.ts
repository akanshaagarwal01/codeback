import { Dispatch } from "react";
import { AnyAction, Store } from "redux";
import { BaseAction, IActionPayload, isBaseAction, PageActionPayload } from "./BaseAction";
import BaseDispatcher from "./BaseDispatcher";
import { ActionHandler } from "./handlers/ActionHandler";

export default abstract class BaseActionDispatcher<T> extends BaseDispatcher<T> {
    public getActionMiddleware(): (store: Store) => (next: Dispatch<AnyAction>) => (action: BaseAction<T, IActionPayload>) => void {
        return (store: Store) => {
            return this._getActionMiddleware(store.getState);
        }
    }

    private _getActionMiddleware(getState: () => any): (next: Dispatch<AnyAction>) => (action: BaseAction<T, IActionPayload>) => void {
        return (next: Dispatch<AnyAction>) => {
            return (action: BaseAction<T, IActionPayload>) => {
                if(isBaseAction(action)) {
                    try {
                        const appState = getState();
                        const handler: ActionHandler<T> | undefined = this.getActionHandler(action.type, this._handlers);
                        if (handler !== undefined) {
                            if (handler.handleAction(action, appState, this.getActionDispatcher(action as BaseAction<T, PageActionPayload<any>>, next, getState))) {
                                return next({type : 'NO_OP'});                               
                            }
                        }
                        return next({ type: action.type, payload: action.payload});
                    } catch (e) {
                        
                    }
                }
                return next({type: 'INVALID_OP'});
            }
        }
    }

    private getActionDispatcher = (action: BaseAction<T, IActionPayload | PageActionPayload<any>>, next: Dispatch<AnyAction>, getState: () => any) => {
        if (action.payload instanceof PageActionPayload) {
            return action.payload?.actionDispatcher;
        }
        return (newAction: AnyAction) => this._getActionMiddleware(getState)(next)(newAction);
    }
}