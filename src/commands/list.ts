import { ApplicationCommandData } from "discord.js";
import { getQueue } from "../player/queue";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "list",
  description: "List tracks.",
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

  const lines = list.map(
    (track) => `${track} -- (${track.duration}) from (User Name TODO )`,
  );
  const str = "Tracks" + lines.join("\n");

  await interaction.reply({ content: str, ephemeral: true });
});
