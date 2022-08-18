import { Plugin, Colors, langs } from "./utils";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { command } from "bdsx/command";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { CustomForm, Form, FormDropdown, FormInput, FormSlider, FormToggle, ModalForm } from "bdsx/bds/form";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { TextPacket } from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";
import { broadcast } from "./main";

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
         *
         *
         *
         */

    }
)


