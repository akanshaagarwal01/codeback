import { ActionDispatcher } from '@common/actions/CommonBaseTypes';
import { BaseAction, IActionPayload } from '../BaseAction';

export type ActionDispatcherType<T> = (action: BaseAction<T, IActionPayload>) => void;

export interface ActionHandler<T> {
    handleAction(action: BaseAction<T, IActionPayload>, state: any, dispatcher: ActionDispatcherType<T> | ActionDispatcher): boolean;
}