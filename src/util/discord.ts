import { joinVoiceChannel } from "@discordjs/voice";
import {
  ApplicationCommandData,
  BaseGuildVoiceChannel,
  CommandInteraction,
  GuildChannel,
  GuildMember,
} from "discord.js";
import { GUILD_ID } from "../config";
import { client } from "../discord";

export function registerCommand(command: ApplicationCommandData): void {
  client.once("ready", () => {
    console.log(`Registering command /${command.name}`);

    const acm = client.application?.commands;
    if (acm) acm.create(command, GUILD_ID);
  });
}

export function addCommandHandler(
  command: ApplicationCommandData,
  handler: (interaction: CommandInteraction) => any,
) {
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName !== command.name) return;

    return handler(interaction);
  });
}

export function join(
  member: GuildMember,
  preferredChannel?: GuildChannel | null,
) {
  let channel: BaseGuildVoiceChannel | null = member.voice.channel;

  // should user's channel be overridden by the channel option?
  if (preferredChannel) {
    if (!preferredChannel.isVoice()) {
      throw new JoinError(`${preferredChannel.name} is not a voice channel.`);
    }
    channel = preferredChannel;
  }

  // can channel be resolved?
  if (!channel) {
    throw new JoinError(
      `You must be connected to a voice channel or provide a custom channel.`,
    );
  }

  // is the channel joinable?
  if (!channel.joinable) {
    throw new JoinError(`I can't join channel ${channel.name}.`);
  }

  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
}
export class JoinError extends Error {}
