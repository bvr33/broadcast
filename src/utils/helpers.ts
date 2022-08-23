import { plugin } from ".."

export const createMessage = (msg: string) => {
    return `${plugin.config.borderColor}${plugin.config.border}\n\n${plugin.config.textColor}${msg}\n\n${plugin.config.borderColor}${plugin.config.border}\n`
}
