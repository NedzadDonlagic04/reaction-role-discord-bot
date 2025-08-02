import dotenv from 'dotenv';
import { Events, GatewayIntentBits } from 'discord.js';
import DiscordClient from './types/DiscordClient.js';
import getSlashCommandsFromFiles from './utils/getCommandsFromFiles.js';

dotenv.config();

const client = new DiscordClient({ intents: [GatewayIntentBits.Guilds] });
const slashCommands = await getSlashCommandsFromFiles();

for (const slashCommand of slashCommands) {
    client.commands.set(slashCommand.data.name, slashCommand);
}

client.on(Events.InteractionCreate, async(interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const interactionClient = interaction.client as DiscordClient;

    const slashCommand = interactionClient.commands.get(interaction.commandName);

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

const main = async () => {
    client.login(process.env.DISCORD_BOT_TOKEN);

    await new Promise(resolve => client.once(Events.ClientReady, resolve));

    console.log('Logged in');
}

main();
