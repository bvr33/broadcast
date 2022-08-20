import { plugin } from ".."

export const createMessage = (msg: string) => {
    return `${plugin.config.borderColor}-----------[ ${plugin.config.textColor}BROADCAST ${plugin.config.borderColor}]-----------\n\n${plugin.config.textColor}${msg}\n\n${plugin.config.borderColor}----------------------------------\n`
}