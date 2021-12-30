import { BaseAction, IPageActionPayload } from "@framework/actions/BaseAction";

export function validateActionForPage<T>(pageId: string, action: BaseAction<T, IPageActionPayload<any>>) {
    const actionPageId = action.payload?.pageId;
    return actionPageId === pageId;
}

export function isPageLevelAction<T>(action: BaseAction<T, IPageActionPayload<any>>) {
    return action && action.payload && 'pageId' in action.payload;
}

