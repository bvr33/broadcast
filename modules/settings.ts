import { CustomForm, FormDropdown, FormInput, FormLabel, FormSlider, FormToggle } from "bdsx/bds/form";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { ServerPlayer } from "bdsx/bds/player";
import { plugin } from "..";
import { Colors } from "../utils/colors";
import { broadcastLoop } from "./loop";
import { sendChangeInfo } from "./messages";


export const changeSettings = (commandUser: ServerPlayer): void => {
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
        plugin.log(`${idx}`)
        f.addComponent(new FormLabel(value))
        f.addComponent(new FormToggle('Remove', false))
        f.addComponent(new FormLabel(`${Colors.Black}--------------`))
    })


    f.sendTo(ni, (data) => {
        data.toJSON
        plugin.log(JSON.stringify(data.toJSON, null, 4))
    });
}