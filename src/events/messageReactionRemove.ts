import {
    Events,
    MessageReaction,
    PartialMessageReaction,
    User,
    PartialUser,
} from 'discord.js';
import Event from '../types/Event.js';
import { prisma } from '../global.js';

const messageReactionRemove = new Event(
    Events.MessageReactionRemove,
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

        await member.roles.remove(result.roleId);
    },
);

export default messageReactionRemove;
