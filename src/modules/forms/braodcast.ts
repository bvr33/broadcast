import { bedrockServer } from "bdsx/launcher"
import { CustomForm, Form, FormDropdown, FormInput, FormLabel, FormSlider, FormToggle, ModalForm } from "bdsx/bds/form"
import { NetworkIdentifier } from "bdsx/bds/networkidentifier"
import { TextPacket } from "bdsx/bds/packets"
import { ServerPlayer } from "bdsx/bds/player"
import { addMessage, changeSettings, delMessage } from "./settings"
import { createMessage } from "../../utils/helpers"


export const broadcast = ( commandUser: ServerPlayer ): void => {
    const f = new Form( {
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
    } )
    f.sendTo( commandUser.getNetworkIdentifier(),
        ( { response } ) => {

            switch( response ) {
                case 0:
                    sendToOne( commandUser )
                    break
                case 1:
                    sendToAll( commandUser )
                    break
                case 2:
                    changeSettings( commandUser )
                    break
                case 3:
                    addMessage( commandUser )
                    break
                case 4:
                    delMessage( commandUser )
                    break
            }
        }
    )
}

const sendToOne = ( commandUser: ServerPlayer ): void => {

    const f = new CustomForm( `Wyślij do send to player` )
    const activePlayers = bedrockServer.serverInstance.getPlayers().filter( p => p !== commandUser )
    if( bedrockServer.serverInstance.getActivePlayerCount() > 1 ) {
        const activePlayersName: string[] = activePlayers.map( p => p.getName() )

        f.addComponent( new FormDropdown( '\n', activePlayersName ) )
        f.addComponent( new FormInput( `message`, `send to player`, '' ) )
        f.sendTo( commandUser.getNetworkIdentifier(),
            ( { response } ) => {
                const msg = response[1] || ""
                if( msg == '' ) {
                    sendToOne( commandUser )
                    return
                }
                const pid = response[0]
                const pl = activePlayers[pid]

                const pkt: TextPacket = TextPacket.allocate()
                pkt.type = TextPacket.Types.Raw
                pkt.message = createMessage( msg )
                pl.sendNetworkPacket( pkt )
                pkt.dispose()
            }
        )
    }
    else {
        commandUser.sendMessage( "No players Found!" )
    }
}

const sendToAll = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm
    f.setTitle( 'send to players' )

    const activePlayers = bedrockServer.serverInstance.getPlayers()

    if( bedrockServer.level.getActivePlayerCount() == 0 ) {
        broadcast( commandUser )
        return
    }

    f.addComponent( new FormInput( `message`, `send to players`, '' ) )

    f.sendTo( commandUser.getNetworkIdentifier(),
        ( { response } ) => {

            const msg = response[0]
            if( msg == '' ) {
                sendToAll( commandUser )
                return
            }
            const pkt: TextPacket = TextPacket.allocate()
            pkt.type = TextPacket.Types.Raw
            pkt.message = createMessage( msg )
            activePlayers.forEach(
                p => {
                    p.sendNetworkPacket( pkt )
                }
            )
            pkt.dispose()
        }
    )
}