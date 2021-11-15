import { getVoiceConnection } from "@discordjs/voice";
import { ApplicationCommandData, GuildMember } from "discord.js";
import { getQueue } from "../player/queue";
import { addCommandHandler, join, registerCommand } from "../util/discord";
import { msToDuration } from "../util/string";

const command: ApplicationCommandData = {
  name: "seek",
  description: "seek.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "time",
      type: "STRING",
      description: "Seek to time?",
      required: true,
    },
  ],
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const member = interaction.member as GuildMember;
  const guild = interaction.guild!;
  const queue = getQueue(guild.id);

  const connection = getVoiceConnection(guild.id);
  if (!connection) {
    join(member);
  }
  const [track, _] = queue.getTrack();

  if (!track) {
    await interaction.reply({ content: "No Track", ephemeral: true });
    return;
  }

  const timeStr = interaction.options.getString("time");

  if (!timeStr || parseFloat(timeStr) == NaN) {
    interaction.replied ||
      interaction.reply({ content: `invalid format`, ephemeral: true });
    return;
  }

  const time = parseFloat(timeStr);

  await queue.seekTo(time);

  const seekTo = time ? msToDuration(time * 1000) : "00:00:00";
  const duration = msToDuration(track.duration);

  interaction.replied ||
    interaction.reply({
      content: `✅ seeked to, ${seekTo} of ${duration}`,
      ephemeral: true,
    });
});
