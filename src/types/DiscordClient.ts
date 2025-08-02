import { Client, Collection } from 'discord.js';
import type { SlashCommand } from './SlashCommand.js';

class DiscordClient extends Client {
    commands: Collection<string, SlashCommand> = new Collection();
}

export default DiscordClient;
