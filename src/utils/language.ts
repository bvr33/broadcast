export enum langs {
    PL = "PL_pl"
}

export interface Language {
    name: string
    messages: { [key: string]: string }
    menuEntries: { [key: string]: string }
    settings: { [key: string]: string },
    texts: { [key: string]: string }
}