import { Events } from 'discord.js';
import Event from './../types/Event.js';
import DiscordClient from '../types/DiscordClient.js';

const interactionCreate = new Event(Events.InteractionCreate, async(interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const discordClient = interaction.client as DiscordClient;
    const slashCommand = discordClient.commands.get(interaction.commandName);

    if (!slashCommand) {
        console.error(`No command with the name ${interaction.commandName} found`);
        return;
    }

    try {
        await slashCommand.execute(interaction);
    } catch (error) {
        console.log(error);
    }
});

export default interactionCreate;
