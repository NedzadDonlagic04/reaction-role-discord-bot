import dotenv from 'dotenv';
import { GatewayIntentBits, Partials } from 'discord.js';
import Event from './types/Event.js';
import { SlashCommand } from './types/SlashCommand.js';
import DiscordClient from './types/DiscordClient.js';
import getAllObjsFromDir from './utils/getAllObjsFromDir.js';
import http from 'http';

dotenv.config();

const { DISCORD_BOT_TOKEN, PORT } = process.env;

const client = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.User],
});

const slashCommands = await getAllObjsFromDir<SlashCommand>('commands');
const events = await getAllObjsFromDir<Event>('events');

for (const slashCommand of slashCommands) {
    client.commands.set(slashCommand.data.name, slashCommand);
}

for (const event of events) {
    if (event.once) {
        client.once(event.name, event.execute);
    } else {
        client.on(event.name, event.execute);
    }
}

try {
    await client.login(DISCORD_BOT_TOKEN);
} catch (error) {
    console.error(`Failed to login with error: ${error}`);
    process.exit(1);
}

// Because atm I am using render's free tier to host this bot
// I can't register it as a background worker so I'm using a web service
// which requires listening on some port
http.createServer((_, res) => res.end('OK')).listen(PORT || 3000);
