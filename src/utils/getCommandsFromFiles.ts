import fs from 'node:fs';
import path from 'node:path';
import { isSlashCommand, type SlashCommand } from '../types/SlashCommand.js';
import { fileURLToPath } from 'node:url';

const getSlashCommandsFromFiles = async (): Promise<SlashCommand[]> => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const commandsFolderPath = path.join(__dirname, '../commands');

    const slashCommands: SlashCommand[] = [];

    const commandFiles = fs
        .readdirSync(commandsFolderPath)
        .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

    for (const commandFile of commandFiles) {
        const absolutePathToCommandFile = path.join(commandsFolderPath, commandFile);
        console.log(absolutePathToCommandFile);
        const command = (await import(absolutePathToCommandFile)).default;

        if (isSlashCommand(command)) {
            slashCommands.push(command);
        }
    }

    return slashCommands;
};

export default getSlashCommandsFromFiles;
