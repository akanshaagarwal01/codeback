export interface IAppGlobalState {

}

export enum APP_CONTENT_STATUS {
    ACTIVE =  'ACTIVE',
    UPDATING = 'UPDATING'
}

export interface IAppContext {
    locale: string;
    appTheme?: Record<string, any>;
    timeStamp: number;
    versions?: any;
    appContentStatus: APP_CONTENT_STATUS
}

export interface IUserContext {
    accountId?: string;
    isLoggedIn: boolean;
}