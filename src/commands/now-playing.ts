import { ApplicationCommandData } from "discord.js";
import { getQueue } from "../player/queue";
import { addCommandHandler, registerCommand } from "../util/discord";
import { msToDuration } from "../util/string";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "np",
  description: "current track info.",
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const guild = interaction.guild!;
  const queue = getQueue(guild.id);
  const [track, position] = queue.getTrack();

  if (!track) {
    await interaction.reply({ content: "No Track", ephemeral: true });
    return;
  }

  const str = `Now Playing:\n${track} - ${msToDuration(position)} -- ${
    track.duration
  }`;

  await interaction.reply({ content: str, ephemeral: true });
});
