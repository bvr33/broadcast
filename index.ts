import { Plugin, Colors, langs } from "./utils";
import { events } from "bdsx/event";
import { command } from "bdsx/command";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { Form, CustomForm, FormDropdown, FormInput, ModalForm, FormSlider, FormToggle } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { TextPacket } from "bdsx/bds/packets";
import { bedrockServer } from "bdsx/launcher";
//destruct
const { serverInstance } = bedrockServer;

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



        const { serverInstance } = bedrockServer

        const broadcast = (commandUser: ServerPlayer) => {
            const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();

            const f = new Form({
                type: 'form',
                title: 'Broadcast',
                content: ``,
                buttons: [
                    {
                        text: 'Send to player',
                        image: {
                            type: 'path',
                            data: './img/banner_pattern.jpg'
                        }
                    },
                    {
                        text: 'Send to players',
                        image: {
                            type: 'path',
                            data: './img/banner_pattern.jpg'
                        }
                    },
                    {
                        text: 'settings',
                        image: {
                            type: 'path',
                            data: './img/book_writable.png'
                        }
                    },
                ]
            });
            f.sendTo(ni, ({ response }, ni) => {

                switch (response) {
                    case 0:
                        {
                            broadcastToPlayer(commandUser);
                        }
                        break;
                    case 1:
                        {
                            broadcastToAll(commandUser);
                        }
                        break;
                    case 2:
                        {
                            settings(commandUser);
                        }
                        break;
                }
            });
        };
        const broadcastToPlayer = (commandUser: ServerPlayer) => {
            const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();

            const f = new CustomForm(`Wyślij do send to player`);
            const activePlayers = serverInstance.getPlayers().filter(p => p !== commandUser);
            if (serverInstance.getActivePlayerCount() > 1) {

                const activePlayersName: string[] = activePlayers.map(p => p.getName());

                f.addComponent(new FormDropdown('\n', activePlayersName));
                f.addComponent(new FormInput(`message`, `send to player`, ''));
                f.sendTo(ni, ({ response }, ni) => {
                    const msg = response[1] || "";
                    if (msg == '') {
                        broadcastToPlayer(commandUser);
                        return;
                    }
                    const pid = response[0];
                    const pl = activePlayers[pid];

                    const pkt: TextPacket = TextPacket.allocate();
                    pkt.type = TextPacket.Types.Raw;
                    pkt.message = msg;
                    pl.sendNetworkPacket(pkt);
                    pkt.dispose();
                });
            }
            else {
                noPlayerFound(commandUser);
            }
        };
        const broadcastToAll = (commandUser: ServerPlayer) => {
            const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();

            const f = new CustomForm;
            f.setTitle('send to players');

            const activePlayers = serverInstance.getPlayers();

            if (serverInstance.getActivePlayerCount() <= 1) {
                broadcast(commandUser);
                return;
            }

            f.addComponent(new FormInput(`message`, `send to players`, ''));
            f.sendTo(ni, ({ response }, ni) => {

                const msg = response[0];
                if (msg == '') {
                    broadcastToAll(commandUser);
                    return;
                }
                const pkt: TextPacket = TextPacket.allocate();
                pkt.type = TextPacket.Types.Raw;
                pkt.message = msg;
                activePlayers.forEach((p) => {
                    p.sendNetworkPacket(pkt);
                });
                pkt.dispose();
            });
        };
        const noPlayerFound = (commandUser: ServerPlayer) => {
            const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();

            const f = new ModalForm('broadcast', 'player ');
            f.setButtonConfirm('mainmenu');
            f.setButtonCancel('exit');
            f.sendTo(ni, ({ response }) => {
                if (response == true)
                    broadcast(commandUser);
            });
        };
        const settings = (commandUser: ServerPlayer) => {
            const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();

            const colors: string[] = [
                `${Colors.Red}red`,
                `${Colors.Gold}gold`,
                `${Colors.Yellow}yellow`,
                `${Colors.Green}green`,
                `${Colors.Aqua}aqua`,
                `${Colors.Blue}blue`,
                `${Colors.LightPurple}light_purple`,
                `${Colors.White}white`,
                `${Colors.Gray}gray`,
                `${Colors.Black}black`,
                `${Colors.DarkRed}darkRed`,
                `${Colors.DarkGreen}darkGreen`,
                `${Colors.DarkAqua}darkAqua`,
                `${Colors.DarkBlue}darkBlue`,
                `${Colors.DarkPurple}darkPurple`,
                `${Colors.DarkGray}darkGray`,
            ];
            const f = new CustomForm(`broadcast settings`);

            f.addComponent(new FormToggle('on', plugin.config.enable));
            f.addComponent(new FormToggle('Random message order', plugin.config.randomOrder));

            const textColorSetNumber: number = Object.values(Colors).indexOf(plugin.config.textColor);

            f.addComponent(new FormDropdown('text color', colors, textColorSetNumber));

            const borderColorSetNumber: number = Object.values(Colors).indexOf(plugin.config.borderColor);
            f.addComponent(new FormDropdown('border color', colors, borderColorSetNumber));
            f.addComponent(new FormSlider('message interval', 1, 10, 1, plugin.config.interval));
            f.sendTo(ni, ({ response }) => {
                plugin.config.enable = response[0];
                plugin.config.randomOrder = response[1];
                plugin.config.textColor = Object.values(Colors)[response[2]];
                plugin.config.borderColor = Object.values(Colors)[response[3]];
                plugin.config.interval = response[4];
                plugin.updateConfig();
                changeSettings(commandUser);
            });
        };
        const changeSettings = (commandUser: ServerPlayer) => {

            const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();
            const f = new Form({
                type: "modal",
                title: `settings broadcast`,
                content: `update setings done`,
                button1: `back`,
                button2: 'exit',
            });
            f.sendTo(ni, ({ response }, ni) => {

                if (response) {
                    broadcast(commandUser);
                }
                return;
            });
        };


        //const broadcast = command.register('broadcast', 'broadcast', CommandPermissionLevel.Operator)
        //
        //
        //broadcast.overload((param, origin, output) => {
        //    if (param.players) {
        //        const preMsg = '§6-------[ §4BROADCAST §6]-------'
        //        const postMsg = preMsg
        //        const pkt = TextPacket.allocate();
        //        pkt.type = TextPacket.Types.Raw;
        //        pkt.message = `${preMsg}\n§5${param.message.text}\n${postMsg}\n`;
        //
        //        for (const player of param.players.newResults(origin, ServerPlayer)) {
        //            player.sendNetworkPacket(pkt)
        //        }
        //        pkt.dispose();
        //
        //    }
        //
        //}, {
        //    players: [PlayerCommandSelector, true],
        //    message: CommandRawText
        //})

    }
)


