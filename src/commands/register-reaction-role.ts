import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandStringOption,
} from 'discord.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('register-reaction-role')
        .setDescription(
            'Registers a message to monitor for reactions and automatically assigns or removes roles',
        )
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName('message-id')
                .setDescription('Message to register for monitoring')
                .setRequired(true),
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const messageId = interaction.options.getString('message-id');

        await interaction.reply(`Registered message "${messageId}"`);
    },
};

export default command;
