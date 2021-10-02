import { ApplicationCommandData } from "discord.js";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "ping",
  description: "Replies with pong.",
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  await interaction.reply({ content: "Pong!", ephemeral: true });
});
