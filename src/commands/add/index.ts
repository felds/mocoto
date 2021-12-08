import { ApplicationCommandData, Message } from "discord.js";
import { addCommandHandler, registerCommand } from "../../util/discord";
import { setTimeout } from "timers/promises";
import assert from "assert/strict";

const command: ApplicationCommandData = {
  name: "add",
  description: "Adds a new track or playlist to the queue",
  type: "CHAT_INPUT",
  options: [
    {
      name: "query",
      description:
        "A URL for the track or playlist, or something to search on YouTube.",
      type: "STRING",
      required: true,
    },
  ],
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  await interaction.deferReply();

  await setTimeout(100);
  interaction.editReply("Editando o reply");
});
