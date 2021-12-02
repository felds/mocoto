import { Client, Intents } from "discord.js";

export const client = new Client({
  intents: [
    // ...
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILDS,
  ],
});

client.setMaxListeners(0);
