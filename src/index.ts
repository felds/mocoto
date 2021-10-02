import { ApplicationCommandData, Client, Intents } from "discord.js";
import { GUILD_ID, TOKEN } from "./config";

console.clear();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

client.login(TOKEN);

client.on("ready", (e) => {
  console.log("Deixa os garoto brincar");
  const acm = client.application?.commands;
  if (acm) {
    const pingCommand: ApplicationCommandData = {
      type: "CHAT_INPUT",
      name: "ping",
      description: "Replies with pong.",
    };
    acm.create(pingCommand, GUILD_ID);

    const serverCommand: ApplicationCommandData = {
      type: "CHAT_INPUT",
      name: "server",
      description: "Replies with server info.",
    };
    acm.create(serverCommand, GUILD_ID);

    const userCommand: ApplicationCommandData = {
      type: "CHAT_INPUT",
      name: "user",
      description: "Replies with user info.",
    };
    acm.create(userCommand, GUILD_ID);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case "ping":
      await interaction.reply({ content: "Pong", ephemeral: true });
      break;
    case "server":
      await interaction.reply({
        content: [
          `Server name: ${interaction.guild?.name}`,
          `Total members: ${interaction.guild?.memberCount}`,
        ].join("\n"),
        ephemeral: true,
      });
      break;
    case "user":
      await interaction.reply({
        content: [
          `Your tag: ${interaction.user.tag}`,
          `Your id: ${interaction.user.id}`,
        ].join("\n"),
        ephemeral: true,
      });
      break;
  }
});
