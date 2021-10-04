import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { GUILD_ID } from "../config";
import { client } from "../discord";

export function registerCommand(command: ApplicationCommandData): void {
  client.once("ready", () => {
    console.log(`Registering command /${command.name}`);

    const acm = client.application?.commands;
    if (acm) acm.create(command, GUILD_ID);
  });
}

export function addCommandHandler(
  command: ApplicationCommandData,
  handler: (interaction: CommandInteraction) => any,
) {
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName !== command.name) return;
    if (!interaction.inGuild()) return;

    return handler(interaction);
  });
}
