import { Plugin } from "./utils/plugin"
import { events } from "bdsx/event";
import { TextFormat } from "bdsx/util";
import './command';

export enum langs {
    PL = "PL_pl"
}

export interface Language {
    name: string
}

export interface Configuration {
    language: langs,
    enable: boolean,
    randomOrder: boolean,
    logToConsole: boolean,
    textColor: string,
    borderColor: string,
    interval: number,
    border: string
    messagesList: string[],
}


export const plugin = new Plugin(
    {
        language: langs.PL,
        enable: true,
        randomOrder: false,
        logToConsole: false,
        textColor: TextFormat.YELLOW,
        borderColor: TextFormat.GRAY,
        interval: 3,
        border: '---------------------',
        messagesList: [
            'welcome to the server!',
        ],
    },
    {
        name: 'Broadcast',
    },
);

events.serverOpen.on( () => {
    plugin.log( `launching` );
} );

events.serverClose.on( () => {
    plugin.log( `closed` );
} );