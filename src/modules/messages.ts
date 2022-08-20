import { Form, ModalForm } from "bdsx/bds/form";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { ServerPlayer } from "bdsx/bds/player";
import { broadcast } from "./braodcast";


export const sendChangeInfo = (commandUser: ServerPlayer, message: string): void => {

    const ni: NetworkIdentifier = commandUser.getNetworkIdentifier();
    const f = new Form({
        type: "modal",
        title: `settings broadcast`,
        content: message,
        button1: `mainmenu`,
        button2: 'exit',
    });
    f.sendTo(ni, ({ response }, ni) => {

        if (response) {
            broadcast(commandUser);
        }
        return;
    });
};

