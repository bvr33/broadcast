import { Plugin } from "./utils/plugin";
import { events } from "bdsx/event";
import { command } from "bdsx/command";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { broadcast } from "./modules/braodcast";
import { TextFormat } from "bdsx/util";

export enum langs {
    PL = "PL_pl"
}

export interface Language {
    name: string
    messages: {}
    menuEntries: {}
    settings: {},
    texts: {}
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
        messages: {},
        settings: {},
        menuEntries: {},
        texts: {}
    },
);


events.serverOpen.on( () => {
    plugin.log( `launching` );
} );

events.serverClose.on( () => {
    plugin.log( `closed` );
} );


events.serverOpen.on(
    () => {

        const cmd = command.register(
            'broadcast',
            'broadcast panel and settings',
            CommandPermissionLevel.Operator
        )
        cmd.alias( 'brp' )
        cmd.overload( ( _param, origin, _output ) => {
            const commandUser = origin.getEntity();
            if( !commandUser?.isPlayer() )
            {
                plugin.log( 'ta komenda jest przeznaczona dla gracza' );
                return;
            }
            broadcast( commandUser );


        },
            {}
        );

        /**
         *
         */


    }
)


