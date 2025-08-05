import {
    Events,
    Interaction,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
    ActionRowBuilder,
    ChatInputCommandInteraction,
    CacheType,
    ButtonInteraction,
    ModalSubmitInteraction,
    MessageFlags,
    EmbedBuilder,
} from 'discord.js';
import Event from './../types/Event.js';
import DiscordClient from '../types/DiscordClient.js';
import { prisma } from '../global.js';
import { findRegistration } from '../utils/registrations.js';

const handleChatInputCommandInteraction = async (
    interaction: ChatInputCommandInteraction<CacheType>,
) => {
    const discordClient = interaction.client as DiscordClient;
    const slashCommand = discordClient.commands.get(interaction.commandName);

    if (!slashCommand) {
        return interaction.reply({
            content: `No command with the name ${interaction.commandName} found`,
            flags: MessageFlags.Ephemeral,
        });
    }

    try {
        return slashCommand.execute(interaction);
    } catch (error) {
        console.log(error);
    }
};

const handleButtonInteraction = async (
    interaction: ButtonInteraction<CacheType>,
) => {
    const emojisAndRolesModal = new ModalBuilder()
        .setCustomId('emojis-and-roles-modal')
        .setTitle('Set Emojis & Roles');

    const rolesIdTxtInput = new TextInputBuilder()
        .setCustomId('roles-id-txt-input')
        .setLabel('Enter role IDs separated by comma')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('1401657072092708864,1401657188723855541,etc.')
        .setRequired(true);

    const emojiNamesTxtInput = new TextInputBuilder()
        .setCustomId('emoji-names-txt-input')
        .setLabel('Enter emoji names separated by comma')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(
            '<:Pepe_Salute:1401812765315829813>,<:PepoAngry:1401812543500189717>,etc.',
        )
        .setRequired(true);

    const rolesIdRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
        rolesIdTxtInput,
    );
    const emojiNamesRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            emojiNamesTxtInput,
        );

    emojisAndRolesModal.addComponents(rolesIdRow, emojiNamesRow);

    return interaction.showModal(emojisAndRolesModal);
};

const handleModalSubmitInteraction = async (
    interaction: ModalSubmitInteraction<CacheType>,
) => {
    const rolesIdRawInput = interaction.fields.getField('roles-id-txt-input');
    const emojiNamesRawInput = interaction.fields.getField(
        'emoji-names-txt-input',
    );

    const roleIds = rolesIdRawInput.value.split(',').map((role) => role.trim());
    const emojiNames = emojiNamesRawInput.value
        .split(',')
        .map((emote) => emote.trim());

    if (roleIds.length !== emojiNames.length) {
        return interaction.reply({
            content: 'The number of roles and emojis must match',
            flags: MessageFlags.Ephemeral,
        });
    }

    const userMessage = findRegistration(
        (userMessage) => userMessage.user.id === interaction.user.id,
    );

    if (!userMessage) {
        return interaction.reply({
            content:
                'Unexpected error occurred, no message saved in registration step',
            flags: MessageFlags.Ephemeral,
        });
    }

    const message = userMessage.message;
    const messageId = message.id;

    for (let i = 0; i < roleIds.length; ++i) {
        const roleId = roleIds[i];
        const emojiName = emojiNames[i];

        await prisma.emojiRoles.create({
            data: {
                messageId: messageId,
                roleId: roleId,
                emojiName: emojiName,
            },
        });

        await userMessage.message.react(emojiName);
    }

    const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
    const embeddedMessage = new EmbedBuilder()
        .setTitle('Reaction Role Registered')
        .setDescription(`[Jump to message](${messageLink})`);

    return interaction.reply({
        embeds: [embeddedMessage],
        flags: MessageFlags.Ephemeral,
    });
};

const interactionCreate = new Event(
    Events.InteractionCreate,
    async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleChatInputCommandInteraction(interaction);
        } else if (interaction.isButton()) {
            await handleButtonInteraction(interaction);
        } else if (interaction.isModalSubmit()) {
            await handleModalSubmitInteraction(interaction);
        }
    },
);

export default interactionCreate;
