import { TextFormat } from 'bdsx/util';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export enum langs {
    PL = "PL_pl"
}
export interface Configuration {
    language: langs,
    enable: boolean,
    randomOrder: boolean,
    logToConsole: boolean
    textColor: string,
    borderColor: string,
    interval: number
}
export interface Language {
    name: string
    messages: { [key: string]: string }
    menuEntries: { [key: string]: string }
    settings: { [key: string]: string },
    texts: { [key: string]: string }
}
export interface Plugin {
    config: Configuration,
    translate: Language
    lang: string,
}

export class Plugin implements Plugin {

    public translate: Language
    public config: Configuration;
    public name: string
    public messagesList: string[]

    private messagesPath: string
    private configs: string
    private configPath: string
    private configFile: string
    private langsPath: string
    private usedLangPath: string

    constructor(initConfiguration: Configuration, initTranslate: Language, messagesList: string[]) {
        this.name = initTranslate.name
        this.configs = join(__dirname, '..', '..', '..', '..', 'config');
        this.configPath = join(this.configs, this.name);
        this.configFile = join(this.configPath, 'config.json');
        this.messagesPath = join(this.configPath, 'messages.json');
        this.langsPath = join(this.configPath, 'lang')

        if (!existsSync(this.configs)) mkdirSync(this.configs)

        if (!existsSync(this.configPath)) mkdirSync(this.configPath)

        if (!existsSync(this.langsPath)) mkdirSync(this.langsPath)

        if (!existsSync(this.configFile)) {
            writeFileSync(this.configFile, JSON.stringify(initConfiguration, null, 4))
        }

        if (!existsSync(this.messagesPath)) {
            writeFileSync(this.messagesPath, JSON.stringify(messagesList, null, 4))
        }
        this.config = JSON.parse(readFileSync(this.configFile, 'utf8'))
        this.messagesList = JSON.parse(readFileSync(this.messagesPath, 'utf8'))

        this.usedLangPath = join(this.langsPath, `${this.config.language}.json`)

        if (!existsSync(this.usedLangPath)) {
            writeFileSync(this.usedLangPath, JSON.stringify(initTranslate, null, 4))
        }
        this.translate = JSON.parse(readFileSync(join(this.usedLangPath), 'utf8'))

    }

    public log(message: string): void {
        const name: string = `[`.red + this.name.green + `]`.red
        const msg: string = `${message}`.green
        console.log(`${name} ${msg}`)
    }

    public updateConfig(): void {
        const configFromFIle = JSON.parse(readFileSync(this.configFile, 'utf8'))
        if (configFromFIle != this.config) writeFileSync(this.configFile, JSON.stringify(this.config, null, 4))
        this.log('config updated')
    }

    public updateMessages(): void {
        const messagesInFile = JSON.parse(readFileSync(this.messagesPath, 'utf8'))
        if (messagesInFile != this.messagesList) writeFileSync(this.messagesPath, JSON.stringify(this.messagesList, null, 4))
        this.log('messages updated')
    }

}
