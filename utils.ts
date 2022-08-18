import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export enum Colors {
    Red = "§c",
    Gold = "§6",
    Yellow = "§e",
    Green = "§a",
    Aqua = "§b",
    Blue = "§9",
    LightPurple = "§d",
    White = "§f",
    Gray = "§7",
    Black = "§0",
    DarkRed = "§4",
    DarkGreen = "§2",
    DarkAqua = "§3",
    DarkBlue = "§1",
    DarkPurple = "§5",
    DarkGray = "§8",
}

export enum langs {
    PL = "PL_pl"
}
export interface Configuration {
    language: langs
    [key: string]: any
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

    private configs: string
    private configPath: string
    private configFile: string
    private langsPath: string
    private usedLangPath: string

    constructor(name: string, initConfiguration: Configuration, initTranslate: Language) {
        this.name = name
        this.configs = join(__dirname, '..', '..', 'config');
        this.configPath = join(this.configs, this.name);
        this.configFile = join(this.configPath, 'config.json');
        this.langsPath = join(this.configPath, 'lang')


        if (!existsSync(this.configs)) mkdirSync(this.configs)

        if (!existsSync(this.configPath)) mkdirSync(this.configPath)

        if (!existsSync(this.langsPath)) mkdirSync(this.langsPath)

        if (!existsSync(this.configFile)) {
            writeFileSync(this.configFile, JSON.stringify(initConfiguration, null, 4))
        }

        this.config = JSON.parse(readFileSync(this.configFile, 'utf8'))

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

}