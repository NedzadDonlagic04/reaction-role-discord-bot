import { REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody, RESTPutAPIApplicationGuildCommandsResult } from "discord.js";
import getAllObjsFromDir from "./utils/getAllObjsFromDir.js";
import dotenv from 'dotenv';
import { SlashCommand } from "./types/SlashCommand.js";

dotenv.config();

const { DISCORD_BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const slashCommands = await getAllObjsFromDir<SlashCommand>('commands');

for (const slashCommand of slashCommands) {
    commands.push(slashCommand.data.toJSON());
}

if (!DISCORD_BOT_TOKEN) {
    throw new TypeError('DISCORD_BOT_TOKEN is not a defined environment variable');
} else if (!CLIENT_ID) {
    throw new TypeError('CLIENT_ID is not a defined environment variable');
} else if (!GUILD_ID) {
    throw new TypeError('GUILD_ID is not a defined environment variable');
}

const rest = new REST().setToken(DISCORD_BOT_TOKEN);

const main = async() => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        ) as RESTPutAPIApplicationGuildCommandsResult;

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch(error) {
        console.error(error);
    }
}

main();

