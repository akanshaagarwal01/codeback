import { ActionHandler } from "./handlers/ActionHandler";

export default abstract class BaseMapper<T> {
    public abstract getAction(type: T): new () => ActionHandler<T>;
}