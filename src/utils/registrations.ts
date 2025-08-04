import { User, Message, Collection } from 'discord.js';

class UserMessage {
    public readonly user: User;
    public readonly message: Message<true>;

    constructor(user: User, message: Message<true>) {
        this.user = user;
        this.message = message;
    }
}

const activeRegistrations: Collection<string, UserMessage> = new Collection();

export const startRegistration = (
    user: User,
    message: Message<true>,
): Collection<string, UserMessage> =>
    activeRegistrations.set(user.id, { user, message });
export const doesRegistrationExist = (userId: string): boolean =>
    activeRegistrations.has(userId);
export const endRegistration = (userId: string): boolean =>
    activeRegistrations.delete(userId);
export const findRegistration = (
    predicate: (value: UserMessage) => boolean,
): UserMessage | undefined => activeRegistrations.find(predicate);
