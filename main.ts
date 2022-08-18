import { Colors } from "./utils";
import { bedrockServer } from "bdsx/launcher";
import { CustomForm, Form, FormDropdown, FormInput, FormLabel, FormSlider, FormToggle, ModalForm } from "bdsx/bds/form";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { TextPacket } from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";
import { plugin } from ".";
import { broadcastLoop, createMessage } from "./broadcastLoop";
import { TypeFormatFlags } from "typescript";

export const broadcast = (commandUser: ServerPlayer): void => {
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
                text: 'Settings',
                image: {
                    type: 'path',
                    data: './img/book_writable.png'
                }
            },
            {
                text: 'Add Message',
                image: {
                    type: 'path',
                    data: './img/book_writable.png'
                }
            },
            {
                text: 'Delete Message',
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
            case 3:
                {
                    addMessage(commandUser);
                }
                break;
            case 4:
                {
                    delMessage(commandUser);
                }
                break;
        }
    });
};

const broadcastToPlayer = (commandUser: ServerPlayer): void => {
    const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();

    const f = new CustomForm(`Wyślij do send to player`);
    const activePlayers = bedrockServer.serverInstance.getPlayers().filter(p => p !== commandUser);
    if (bedrockServer.serverInstance.getActivePlayerCount() > 1) {

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
            pkt.message = createMessage(msg)
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

    const activePlayers = bedrockServer.serverInstance.getPlayers();

    if (bedrockServer.level.getActivePlayerCount() == 0) {
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
        pkt.message = createMessage(msg)
        activePlayers.forEach((p) => {
            p.sendNetworkPacket(pkt);
        });
        pkt.dispose();
    });
};
const noPlayerFound = (commandUser: ServerPlayer): void => {
    const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();

    const f = new ModalForm('broadcast', 'player not found ');
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
        broadcastLoop.reload()
        changeInfo(commandUser, `update setings done`);
    });
};
const changeInfo = (commandUser: ServerPlayer, message: string): void => {

    const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();
    const f = new Form({
        type: "modal",
        title: `settings broadcast`,
        content: message,
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

const addMessage = (commandUser: ServerPlayer) => {
    const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();
    const f = new CustomForm(`Add Message`)
    f.addComponent(new FormInput('message', 'Message content', ''))

    f.sendTo(ni, ({ response }, ni) => {
        const msg = response[0];
        if (msg == '') {
            addMessage(commandUser);
            return;
        }
        plugin.messagesList.push(msg)
        plugin.updateMessages()
        changeInfo(commandUser, 'update messages list')

    });
}
const delMessage = (commandUser: ServerPlayer) => {
    const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();
    const f = new CustomForm(`Delete Message`)
    plugin.messagesList.forEach((value, idx) => {
        plugin.log(`${idx}`)
        f.addComponent(new FormLabel(value))
        f.addComponent(new FormToggle('Remove', false))
        f.addComponent(new FormLabel(`${Colors.Black}--------------`))
    })


    f.sendTo(ni, ({ response }, ni) => {
        plugin.log(response)
    });
}
