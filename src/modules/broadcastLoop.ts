
import { bedrockServer } from "bdsx/launcher";
import { TextPacket } from "bdsx/bds/packets";
import { events } from "bdsx/event";
import { plugin } from "..";
import { createMessage } from "../utils/helpers";

let loop: NodeJS.Timeout
let messageIndex: number = 0
let messagesCount: number

export namespace broadcastLoop {


    export function start(): void {
        if( plugin.config.enable )
        {
            updateMessage()

            loop = setInterval(
                () => {
                    const activePlayers = bedrockServer.serverInstance.getPlayers();
                    const pkt: TextPacket = TextPacket.allocate();
                    pkt.type = TextPacket.Types.Raw;
                    let message: string
                    if( messagesCount > 1 )
                    {

                        if( plugin.config.randomOrder ) messageIndex = Math.floor( Math.random() * messagesCount )
                        else
                        {
                            if( messageIndex >= messagesCount ) messageIndex = 0
                            else messageIndex++

                        }
                    } else messageIndex = 0

                    message = plugin.config.messagesList[messageIndex]

                    if( plugin.config.logToConsole ) plugin.log( `${'message'.gray} ${'->'.yellow} ${message}` )
                    pkt.message = createMessage( message )
                    activePlayers.forEach( p => p.sendNetworkPacket( pkt ) );
                    pkt.dispose();

                },
                plugin.config.interval * 60000
            )
        }
    }

    export function stop(): void {
        clearInterval( loop )
    }

    export function updateMessage(): void {
        plugin.updateConfig()
        messagesCount = plugin.config.messagesList.length - 1
    }


    events.serverOpen.on(
        async () => {
            start()
        }
    )
}