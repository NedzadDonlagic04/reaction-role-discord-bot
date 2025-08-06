import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    Collection,
    MessageFlags,
    NonThreadGuildBasedChannel,
    SlashCommandBuilder,
    SlashCommandStringOption,
    TextChannel,
} from 'discord.js';
import {
    doesRegistrationExist,
    endRegistration,
    startRegistration,
} from '../utils/registrations.js';
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

const registerReactionRole = {
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
        const MINUTES_TO_WAIT = 3;

        const user = interaction.user;

        if (doesRegistrationExist(user.id)) {
            return interaction.reply({
                content: `Cannot start multiple message registers at once, wait for the previous one to time out, it should take around ~${MINUTES_TO_WAIT} since the registration started`,
                flags: MessageFlags.Ephemeral,
            });
        }

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

        if (registeredMessages.length !== 0) {
            return interaction.reply({
                content: `This message is already registered with ${registeredMessages.length} emojis / roles`,
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

            const setEmotesAndRolesBtn = new ButtonBuilder()
                .setCustomId('set-emotes-and-roles')
                .setLabel('Set Emotes And Roles')
                .setStyle(ButtonStyle.Primary);

            const btnRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                setEmotesAndRolesBtn,
            );

            startRegistration(user, message);
            setTimeout(async () => {
                endRegistration(user.id);
                try {
                    await interaction.deleteReply();
                } catch (error) {
                    console.error(`Error: ${error}`);
                }
            }, MINUTES_TO_WAIT * 60_000);

            await interaction.editReply({
                content: 'Fill out and submit the modal to finish registration',
                components: [btnRow],
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

export default registerReactionRole;
