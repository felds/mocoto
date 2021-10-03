import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from "@discordjs/voice";
import {
  ApplicationCommandData,
  CommandInteraction,
  GuildMember,
  Message,
} from "discord.js";
import ytdl from "ytdl-core";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "join",
  description: "Join a voice channel.",
  options: [
    {
      name: "url",
      type: "STRING",
      description: "An youtube URL to play",
      required: true,
    },
  ],
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  if (!interaction.inGuild()) return;

  const url = interaction.options.getString("url");
  if (!url) {
    to(interaction, `Invalid URL`);
    return;
  }

  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel || !voiceChannel.isVoice()) {
    to(interaction, "Cadê canal?");
    return;
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guildId,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();
  connection.subscribe(player);

  const stream = ytdl(url, { filter: "audioonly" });
  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
  });

  player.play(resource);
  player.on(AudioPlayerStatus.Idle, () => connection.destroy());
  to(interaction, "ok");
});

async function to(interaction: CommandInteraction, content: string) {
  const reply = (await interaction.reply({
    content,
    // ephemeral: true,
    fetchReply: true,
  })) as Message;
  setTimeout(() => reply.delete(), 1000);

  return reply;
}
