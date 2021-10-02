import { ApplicationCommandData } from "discord.js";
import { GUILD_ID } from "../config";
import { client } from "../discord";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "ping",
  description: "Replies with pong.",
};

client.once("ready", () => {
  const acm = client.application?.commands;
  if (acm) acm.create(command, GUILD_ID);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName !== command.name) return;

  await interaction.reply({ content: "Pong", ephemeral: true });
});
