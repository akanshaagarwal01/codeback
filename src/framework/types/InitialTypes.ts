export interface IActionDispatcher<T> {
    actionDispatcher: (action: BaseAction<T, IActionPayload>) => void;
}