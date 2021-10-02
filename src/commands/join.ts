import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import {
  ApplicationCommandData,
  CommandInteraction,
  GuildMember,
  Message,
} from "discord.js";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "join",
  description: "Join a voice channel.",
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  if (!interaction.inGuild()) return;

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

  // const player = createAudioPlayer();
  // connection.subscribe(player);

  // const mp3 = "...";
  // const audio = createAudioResource(mp3);
  // player.play(audio);

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
