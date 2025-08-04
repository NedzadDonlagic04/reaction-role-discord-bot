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
        const user = interaction.user;

        if (doesRegistrationExist(user.id)) {
            return interaction.reply({
                content: 'Cannot start multiple message registers at once',
                flags: MessageFlags.Ephemeral,
            });
        }

        let messageId = interaction.options.getString('message-id');

        if (!interaction.guild) {
            return interaction.reply({
                content: 'This command can only be used in a server channel',
                flags: MessageFlags.Ephemeral,
            });
        } else if (!messageId) {
            return interaction.reply({
                content: 'Message id not valid',
                flags: MessageFlags.Ephemeral,
            });
        }

        messageId = messageId.trim();

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

            const MINUTES_TO_WAIT = 1;
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
                content: `Registered message made by "${message.author}" with the content "${message.content}"`,
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
