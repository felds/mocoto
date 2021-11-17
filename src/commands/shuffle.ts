import { ApplicationCommandData } from "discord.js";
import { getQueue } from "../player/queue";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "shuffle",
  description: "shuffle tracks.",
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const guild = interaction.guild!;
  const queue = getQueue(guild.id);
  const list = queue.getTracks();

  if (!list.length) {
    await interaction.reply({ content: "No Tracks", ephemeral: true });
    return;
  }

  await queue.shuffle();

  await interaction.reply({ content: "Shuffled", ephemeral: true });
});
