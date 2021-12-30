import { ActionDispatcher } from "@framework/actions/BaseAction";


export enum PAGE_STATE {
    INIT = 'INIT',
    SUCCESS = 'SUCCESS'
}

export interface IPageCreatorMainComponentProps {}

export interface IPageSlotsDataState {

}

export interface IPageSlotsState {

}

export interface IPageDateState {}

export interface IPageState {}

export type pageLevelSlots = Record<number, Slot[]>;

export type MultiWidgetPageProps = IPageState & IActionDispatcher;

export interface IActionDispatcher {
    actionDispatcher: ActionDispatcher
}