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
  var trackInfo = queue.getTrack();

  var str = "Now Playing:\n";

  str += `${trackInfo[0]} - ${msToDuration(trackInfo[1])} -- ${
    trackInfo[0].duration
  }`;

  await interaction.reply({ content: str, ephemeral: true });
});
