import { Plugin, Colors, langs } from "./utils";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { command } from "bdsx/command";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { CustomForm, Form, FormDropdown, FormInput, FormSlider, FormToggle, ModalForm } from "bdsx/bds/form";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { TextPacket } from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";

const plugin = new Plugin(
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
            (commandUser);

        },
            {}
        );

        /**
         *
         *
         *
         *
         */

        const { serverInstance } = bedrockServer

        const broadcast = (commandUser: ServerPlayer): void => {
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
        const broadcastToPlayer = (commandUser: ServerPlayer): void => {
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

                    const preMsg = `${plugin.config.borderColor}-------[ ${plugin.config.textColor}BROADCAST ${plugin.config.borderColor}]-------`
                    const postMsg = preMsg
                    const pkt: TextPacket = TextPacket.allocate();
                    pkt.type = TextPacket.Types.Raw;
                    pkt.message = `${preMsg}\n${plugin.config.textColor}${msg}\n${postMsg}\n`
                    pl.sendNetworkPacket(pkt);
                    pkt.dispose();
                });
            }
            else {
                noPlayerFound(commandUser);
            }
        };
        const broadcastToAll = (commandUser: ServerPlayer): void => {
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
                const preMsg = `${plugin.config.borderColor}-------[ ${plugin.config.textColor}BROADCAST ${plugin.config.borderColor}]-------`
                const postMsg = preMsg
                const pkt: TextPacket = TextPacket.allocate();
                pkt.type = TextPacket.Types.Raw;
                pkt.message = `${preMsg}\n${plugin.config.textColor}${msg}\n${postMsg}\n`
                activePlayers.forEach((p) => {
                    p.sendNetworkPacket(pkt);
                });
                pkt.dispose();
            });
        };
        const noPlayerFound = (commandUser: ServerPlayer): void => {
            const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();

            const f = new ModalForm('broadcast', 'player ');
            f.setButtonConfirm('mainmenu');
            f.setButtonCancel('exit');
            f.sendTo(ni, ({ response }) => {
                if (response == true)
                    broadcast(commandUser);
            });
        };
        const settings = (commandUser: ServerPlayer): void => {
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
        const changeSettings = (commandUser: ServerPlayer): void => {

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






    }
)


