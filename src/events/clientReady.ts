import { Events } from 'discord.js';
import Event from './../types/Event.js';
import DiscordClient from '../types/DiscordClient.js';

const clientReady = new Event(
    Events.ClientReady,
    (client: DiscordClient) => console.log(`Logged in as ${client.user?.tag}`)
);

export default clientReady;
