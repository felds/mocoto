import { joinVoiceChannel } from "@discordjs/voice";
import { BaseGuildVoiceChannel, Client, Intents } from "discord.js";

export const client = new Client({
  intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS],
});

export function join(channel: BaseGuildVoiceChannel) {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
}
