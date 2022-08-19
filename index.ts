import { Plugin, langs } from "./utils/plugin";
import { events } from "bdsx/event";
import { command } from "bdsx/command";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { broadcast } from "./modules/braodcast";
import { Colors } from "./utils/colors";


export const plugin = new Plugin(
    {
        language: langs.PL,
        enable: true,
        randomOrder: false,
        textColor: Colors.Red,
        borderColor: Colors.Yellow,
        interval: 3,
    },
    {
        name: 'Broadcast',
        messages: {},
        settings: {},
        menuEntries: {},
        texts: {}
    },
    [
        'welcome to the server',
    ]
);


events.serverOpen.on(() => {
    plugin.log(`launching`);
});

events.serverClose.on(() => {
    plugin.log(`closed`);
});


events.serverOpen.on(
    () => {

        const cmd = command.register(
            'broadcast',
            'broadcast panel and settings',
            CommandPermissionLevel.Operator
        )
        cmd.alias('brp')
        cmd.overload((_param, origin, _output) => {
            const commandUser = origin.getEntity();
            if (!commandUser?.isPlayer()) {
                plugin.log('ta komenda jest przeznaczona dla gracza');
                return;
            }
            broadcast(commandUser);


        },
            {}
        );

        /**
         *
         */


    }
)


