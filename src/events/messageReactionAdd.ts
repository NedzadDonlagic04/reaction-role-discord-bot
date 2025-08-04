import {
    Events,
    MessageReaction,
    PartialMessageReaction,
    User,
    PartialUser,
    GuildEmoji,
} from 'discord.js';
import Event from '../types/Event.js';
import { prisma } from '../global.js';

const messageReactionAdd = new Event(
    Events.MessageReactionAdd,
    async (
        reaction: MessageReaction | PartialMessageReaction,
        user: User | PartialUser,
    ) => {
        if (user.bot) {
            return;
        }

        if (reaction.partial) {
            await reaction.fetch();
        }
        if (user.partial) {
            await user.fetch();
        }
        if (reaction.message.partial) {
            await reaction.message.fetch();
        }

        const guild = reaction.message.guild;

        if (!guild) {
            return;
        }

        const messageId = reaction.message.id;

        if (!(reaction.emoji instanceof GuildEmoji)) {
            console.error('Emoji not a custom emoji');
            return;
        }

        const emoji = reaction.emoji;

        if (!emoji.name) {
            console.error('Emoji name is null');
            return;
        }

        const emojiName = `<:${emoji.name}:${emoji.id}>`;

        const result = await prisma.emojiRoles.findFirst({
            where: {
                messageId: messageId,
                emojiName: emojiName,
            },
        });

        if (!result) {
            console.error(
                `No result exists for message id "${messageId}" and emoji "${emojiName}"`,
            );
            return;
        }

        const member = await guild.members.fetch(user.id);

        await member.roles.add(result.roleId);
    },
);

export default messageReactionAdd;
