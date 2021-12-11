import {
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  ApplicationCommandData,
  BaseGuildVoiceChannel,
  GuildChannel,
  BaseCommandInteraction,
  GuildMember,
} from "discord.js";
import { GUILD_ID } from "../config";
import { client } from "../discord";

export function registerCommand(command: ApplicationCommandData): void {
  client.once("ready", () => {
    console.log(`Registering command /${command.name}`);

    const acm = client.application?.commands;
    if (acm) {
      if (GUILD_ID) {
        // create commands for the guild only
        acm.create(command, GUILD_ID);
      } else {
        // create commands for all guilds
        // it may take up to 2 hours to take effect
        acm.create(command);
      }
    }
  });
}

export function addCommandHandler(
  command: ApplicationCommandData,
  handler: (interaction: BaseCommandInteraction) => Promise<void>,
) {
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName !== command.name) return;
    if (!interaction.inGuild()) return;

    /** @todo add error checkgin right here */
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

  const adapterCreator = channel.guild
    .voiceAdapterCreator as DiscordGatewayAdapterCreator;

  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator,
  });
}
export class JoinError extends Error {}
