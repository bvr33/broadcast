import { CustomForm, FormDropdown, FormInput, FormLabel, FormSlider, FormToggle } from "bdsx/bds/form";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { ServerPlayer } from "bdsx/bds/player";
import { TextFormat } from "bdsx/util";
import { plugin } from "..";
import { broadcastLoop } from "./loop";
import { sendChangeInfo } from "./messages";


export const changeSettings = (commandUser: ServerPlayer): void => {
    const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();

    const colors: string[] = [
        `${TextFormat.RED}red`,
        `${TextFormat.GOLD}gold`,
        `${TextFormat.YELLOW}yellow`,
        `${TextFormat.GREEN}green`,
        `${TextFormat.AQUA}aqua`,
        `${TextFormat.BLUE}blue`,
        `${TextFormat.LIGHT_PURPLE}light_purple`,
        `${TextFormat.WHITE}white`,
        `${TextFormat.GRAY}gray`,
        `${TextFormat.BLACK}black`,
        `${TextFormat.DARK_RED}darkRed`,
        `${TextFormat.DARK_GREEN}darkGreen`,
        `${TextFormat.DARK_AQUA}darkAqua`,
        `${TextFormat.DARK_BLUE}darkBlue`,
        `${TextFormat.DARK_PURPLE}darkPurple`,
        `${TextFormat.DARK_GRAY}darkGray`,
    ];
    const f = new CustomForm(`broadcast settings`);

    f.addComponent(new FormToggle('On', plugin.config.enable));
    f.addComponent(new FormToggle('Random message order', plugin.config.randomOrder));
    f.addComponent(new FormToggle('Log to Console', plugin.config.logToConsole));

    const textColorSetNumber: number = Object.values(TextFormat).indexOf(plugin.config.textColor);

    f.addComponent(new FormDropdown('text color', colors, textColorSetNumber));

    const borderColorSetNumber: number = Object.values(TextFormat).indexOf(plugin.config.borderColor);
    f.addComponent(new FormDropdown('border color', colors, borderColorSetNumber));
    f.addComponent(new FormSlider('message interval', 1, 10, 1, plugin.config.interval));
    f.sendTo(ni, ({ response }) => {
        plugin.config.enable = response[0];
        plugin.config.randomOrder = response[1];
        plugin.config.logToConsole = response[2];
        plugin.config.textColor = Object.values(TextFormat)[response[3]];
        plugin.config.borderColor = Object.values(TextFormat)[response[4]];
        plugin.config.interval = response[5];
        plugin.updateConfig();
        broadcastLoop.reload()
        sendChangeInfo(commandUser, `update setings done`);
    });
};

export const addMessage = (commandUser: ServerPlayer) => {
    const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();
    const f = new CustomForm(`Add Message`)
    f.addComponent(new FormInput('message', 'Message content', ''))

    f.sendTo(ni, ({ response }) => {
        const msg = response[0];
        if (msg == '') {
            addMessage(commandUser);
            return;
        }
        plugin.messagesList.push(msg)
        plugin.updateMessages()
        sendChangeInfo(commandUser, 'update messages list')

    });
}
export const delMessage = (commandUser: ServerPlayer) => {
    const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();
    const f = new CustomForm(`Delete Message`)
    plugin.messagesList.forEach((value, idx) => {
        f.addComponent(new FormLabel(value))
        f.addComponent(new FormToggle('Remove', false))
        f.addComponent(new FormLabel(`${TextFormat.WHITE}--------------`))
    })


    f.sendTo(ni, ({ response }) => {
        const filteredResponse: boolean[] = response.filter((value: boolean | null) => value != null)
        filteredResponse.forEach((v, i) => {
            if (v) plugin.messagesList.splice(i, 1)
        })
        plugin.updateMessages()
        broadcastLoop.reloadMessage()
    });
}