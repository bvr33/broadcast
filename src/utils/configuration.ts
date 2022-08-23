import { langs } from "./language"

export interface Configuration {
    language: langs,
    enable: boolean,
    randomOrder: boolean,
    logToConsole: boolean
    textColor: string,
    borderColor: string,
    interval: number
    border:string,
}