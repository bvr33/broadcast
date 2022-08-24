import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { langs, Language, Configuration } from '..'

export interface Plugin {
    config: Configuration,
    translate: Language,
}

export class Plugin implements Plugin {

    public translate: Language
    public config: Configuration;
    public name: string

    private configs: string = join( __dirname, '..', '..', 'config' );
    private configPath: string
    private configFile: string
    private langsPath: string
    private usedLangPath: string

    constructor ( initConfiguration: Configuration, initTranslate: Language ) {
        this.name = initTranslate.name
        this.configPath = join( this.configs, this.name );
        this.configFile = join( this.configPath, 'config.json' );
        this.langsPath = join( this.configPath, 'lang' )

        if( !existsSync( this.configs ) ) mkdirSync( this.configs )

        if( !existsSync( this.configPath ) ) mkdirSync( this.configPath )

        if( !existsSync( this.langsPath ) ) mkdirSync( this.langsPath )

        if( !existsSync( this.configFile ) ) writeFileSync( this.configFile, JSON.stringify( initConfiguration, null, 4 ) )


        this.config = JSON.parse( readFileSync( this.configFile, 'utf8' ) )

        this.usedLangPath = join( this.langsPath, `${this.config.language}.json` )

        if( !existsSync( this.usedLangPath ) ) writeFileSync( this.usedLangPath, JSON.stringify( initTranslate, null, 4 ) )

        this.translate = JSON.parse( readFileSync( join( this.usedLangPath ), 'utf8' ) )
    }

    public log( message: string ): void {
        const name: string = `[`.red + this.name.green + `]`.red
        const msg: string = `${message}`.green
        console.log( `${name} ${msg}` )
    }

    public updateConfig(): void {
        const configFromFIle = JSON.parse( readFileSync( this.configFile, 'utf8' ) )
        if( configFromFIle != this.config ) writeFileSync( this.configFile, JSON.stringify( this.config, null, 4 ) )
        this.log( 'config updated' )
    }
}
