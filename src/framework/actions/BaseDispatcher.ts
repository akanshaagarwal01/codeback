import { ActionHandler } from './handlers/ActionHandler';

export default abstract class BaseDispatcher<T> {
    public _handlers: Map<T, ActionHandler<T>> = new Map<T, ActionHandler<T>>();
    public abstract getActionHandler(type: T, handlers: Map<T, ActionHandler<T>>): ActionHandler<T> | undefined;
}