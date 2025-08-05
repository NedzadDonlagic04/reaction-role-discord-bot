import {
    ChatInputCommandInteraction,
    Collection,
    MessageFlags,
    NonThreadGuildBasedChannel,
    SlashCommandBuilder,
    SlashCommandStringOption,
    TextChannel,
} from 'discord.js';
import { prisma } from '../global.js';

const findMessageInChannels = async (
    messageId: string,
    channels: Collection<string, NonThreadGuildBasedChannel | null>,
) => {
    for (const [_, channel] of channels) {
        if (channel instanceof TextChannel) {
            try {
                const message = await channel.messages.fetch(messageId);

                return message;
            } catch (error) {
                // Use when debugging
                // console.error(error);
            }
        }
    }

    return null;
};

const unregisterReactionRole = {
    data: new SlashCommandBuilder()
        .setName('unregister-reaction-role')
        .setDescription(
            'Stops tracking reactions on a message and removes all its reactions.',
        )
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName('message-id')
                .setDescription('Message to unregister from monitoring')
                .setRequired(true),
        ),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const channelMessageId = interaction.options.getString('message-id');

        if (!interaction.guild) {
            return interaction.reply({
                content: 'This command can only be used in a server channel',
                flags: MessageFlags.Ephemeral,
            });
        } else if (!channelMessageId) {
            return interaction.reply({
                content: 'Message id not valid',
                flags: MessageFlags.Ephemeral,
            });
        }

        // Because the id will be in a format <channelId>-<messageId>
        // we split the string by '-' and take the 2nd element
        const messageId = channelMessageId.trim().split('-')[1];

        const registeredMessages = await prisma.emojiRoles.findMany({
            where: {
                messageId: messageId,
            },
        });

        if (registeredMessages.length === 0) {
            return interaction.reply({
                content: 'This message is not registered',
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const channels = await interaction.guild.channels.fetch();
            const message = await findMessageInChannels(messageId, channels);

            if (!message) {
                throw new TypeError(
                    `Couldn't find message with id "${messageId}"`,
                );
            }

            await prisma.emojiRoles.deleteMany({
                where: {
                    messageId: messageId,
                },
            });

            await message.reactions.removeAll();

            await interaction.editReply({
                content: 'Unregistered message and removed all reactions',
            });
        } catch (error) {
            if (error instanceof TypeError) {
                await interaction.editReply(error.message);
            } else {
                await interaction.editReply('Unknown error occurred');
            }
        }
    },
};

export default unregisterReactionRole;
