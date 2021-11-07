import { ApplicationCommandData } from "discord.js";
import { getQueue } from "../player/queue";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "list",
  description: "List musics to play.",
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const guild = interaction.guild!;
  const queue = getQueue(guild.id);
  var list = queue.getTracks();

  if (!list.length) {
    await interaction.reply({ content: "No Tracks", ephemeral: true });
    return;
  }

  var str = "Musics";
  for (let i = 0; i < list.length; i++) {
    str += `\n (${i + 1}) - `;
    str += `${list[i]} -- (${list[i].duration}) from (User Name TODO )`;
  }

  await interaction.reply({ content: str, ephemeral: true });
});
