import { Plugin, Colors, langs } from "./utils";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { command } from "bdsx/command";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { broadcast } from "./main";
//destruct

export const plugin = new Plugin(
    'broadcast',
    {
        language: langs.PL,
        enable: true,
        randomOrder: false,
        textColor: Colors.Red,
        borderColor: Colors.Yellow,
        interval: 3
    },
    {
        name: 'Broadcast',
        messages: {},
        settings: {},
        menuEntries: {},
        texts: {}
    }
);


events.serverOpen.on(() => {
    plugin.log(`launching`);
});

events.serverClose.on(() => {
    plugin.log(`closed`);
});


events.serverOpen.on(
    () => {

        command.register(
            'broadcast',
            'broadcast panel and settings',
            CommandPermissionLevel.Operator
        )
            .alias('brp')
            .overload((_param, origin, _output) => {
                const commandUser = origin.getEntity();
                if (!commandUser?.isPlayer()) {
                    plugin.log('ta komenda jest przeznaczona dla gracza');
                    return;
                }
                broadcast(commandUser);

            },
                {}
            );

    }
)


