export enum Languages {
    Hi = 'hi',
    EN = 'en'
}

export interface IVernacular<T> {
    [Languages.EN]: T;
    [Languages.Hi]: T;
}

export default Languages;
