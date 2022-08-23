
import { bedrockServer } from "bdsx/launcher";
import { TextPacket } from "bdsx/bds/packets";
import { events } from "bdsx/event";
import { plugin } from "..";
import { createMessage } from "../utils/helpers";

export interface BroadcastLoop {
    start(): void
    stop(): void
    reloadMessage(): void
}

export class BroadcastLoop implements BroadcastLoop {

    private loop: NodeJS.Timeout
    private messageIndex: number = 0
    private messagesCount: number

    constructor () {
        events.serverOpen.on( async () => {
            this.start()
        }
        )
    }


    public start = () => {
        if( plugin.config.enable )
        {
            this.updateMessage()

            this.loop = setInterval(
                () => {
                    const activePlayers = bedrockServer.serverInstance.getPlayers();
                    const pkt: TextPacket = TextPacket.allocate();
                    pkt.type = TextPacket.Types.Raw;
                    let message: string
                    if( this.messagesCount > 1 )
                    {

                        if( plugin.config.randomOrder ) this.messageIndex = Math.floor( Math.random() * this.messagesCount )
                        else
                        {
                            if( this.messageIndex >= this.messagesCount ) this.messageIndex = 0
                            else this.messageIndex++

                        }
                    } else this.messageIndex = 0

                    message = plugin.messagesList[this.messageIndex]

                    if( plugin.config.logToConsole ) plugin.log( `${'message'.gray} ${'->'.yellow} ${message}` )
                    pkt.message = createMessage( message )
                    activePlayers.forEach( ( p ) => {
                        p.sendNetworkPacket( pkt );
                    } );
                    pkt.dispose();

                },
                plugin.config.interval * 60000

            )

        }

    }

    public stop = () => {
        clearInterval( this.loop )
    }

    public updateMessage = () => {
        plugin.updateMessages()
        this.messagesCount = plugin.messagesList.length - 1
    }

}

export const broadcastLoop = new BroadcastLoop()