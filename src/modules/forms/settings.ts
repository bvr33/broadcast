import { CustomForm, FormDropdown, FormInput, FormLabel, FormSlider, FormToggle } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { TextFormat } from "bdsx/util";
import { plugin } from "../..";
import { broadcastLoop } from "../broadcastLoop";

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

export const changeSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( `broadcast settings` );
    // on /off button
    f.addComponent( new FormToggle( 'On', plugin.config.enable ) );
    // random message orger button
    f.addComponent( new FormToggle( 'Random message order', plugin.config.randomOrder ) );
    //log broadcast messages to console
    f.addComponent( new FormToggle( 'Log to Console', plugin.config.logToConsole ) );

    //message border
    f.addComponent( new FormInput( 'Border', 'border', plugin.config.border ) );

    //message color
    const textColorSetNumber: number = Object.values( TextFormat ).indexOf( plugin.config.textColor );
    f.addComponent( new FormDropdown( 'text color', colors, textColorSetNumber ) );

    //message border color
    const borderColorSetNumber: number = Object.values( TextFormat ).indexOf( plugin.config.borderColor );
    f.addComponent( new FormDropdown( 'border color', colors, borderColorSetNumber ) );

    f.addComponent( new FormSlider( 'message interval', 1, 10, 1, plugin.config.interval ) );

    f.sendTo( commandUser.getNetworkIdentifier(),
        ( { response } ) => {
            plugin.config.enable = response[0];
            plugin.config.randomOrder = response[1];
            plugin.config.logToConsole = response[2];
            plugin.config.border = response[3];
            plugin.config.textColor = Object.values( TextFormat )[response[4]];
            plugin.config.borderColor = Object.values( TextFormat )[response[5]];
            plugin.config.interval = response[6];
            plugin.updateConfig();
            commandUser.sendMessage( `update setings done` );
        }
    );
};

export const addMessage = ( commandUser: ServerPlayer ) => {
    const f = new CustomForm( `Add Message` )
    f.addComponent( new FormInput( 'message', 'Message content', '' ) )

    f.sendTo( commandUser.getNetworkIdentifier(),
        ( { response } ) => {
            const msg = response[0];
            if( msg == '' )
            {
                addMessage( commandUser );
                return;
            }
            plugin.config.messagesList.push( msg )
            broadcastLoop.updateMessage()
            commandUser.sendMessage( 'update messages list done' )

        }
    );
}
export const delMessage = ( commandUser: ServerPlayer ) => {
    const f = new CustomForm( `Delete Message` )
    plugin.config.messagesList.forEach(
        ( value: string, idx: number ) => {
            f.addComponent( new FormLabel( value ) )
            f.addComponent( new FormToggle( 'Remove', false ) )
            f.addComponent( new FormLabel( `${TextFormat.WHITE}--------------` ) )
        }
    )

    f.sendTo( commandUser.getNetworkIdentifier(),
        ( { response } ) => {
            const filteredResponse: boolean[] = response.filter( ( value: boolean | null ) => value != null )
            filteredResponse.forEach(
                ( v, i ) => {
                    if( v ) plugin.config.messagesList.splice( i, 1 )
                }
            )
            broadcastLoop.updateMessage()
        }
    );
}