import { events } from "bdsx/event";
import { command } from "bdsx/command";
import { CommandPermissionLevel } from "bdsx/bds/command";
import { broadcast } from "./modules/forms/braodcast";
import { plugin } from ".";

events.serverOpen.on(
    () => {

        const cmd = command.register(
            'broadcast',
            'broadcast panel and settings',
            CommandPermissionLevel.Operator
        )
        cmd.alias( 'brp' )
        cmd.overload( ( _param, origin, _output ) => {
            const commandUser = origin.getEntity();
            if( !commandUser?.isPlayer() )
            {
                plugin.log( 'ta komenda jest przeznaczona dla gracza' );
                return;
            }
            broadcast( commandUser );
        },
            {}
        );
    }
)