import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export function isSlashCommand(object: any): object is SlashCommand {
    return (
        object &&
        object.data instanceof SlashCommandBuilder &&
        typeof object.execute === 'function'
    );
}
