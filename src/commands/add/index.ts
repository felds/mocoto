import {
  ApplicationCommandData,
  Emoji,
  Message,
  MessageActionRow,
  MessageOptions,
  ReactionEmoji,
} from "discord.js";
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
  await interaction.deferReply({ ephemeral: true });

  // prettier-ignore
  const components: MessageOptions['components'] = 
  [
    {type: "ACTION_ROW", components: [
      { type: "SELECT_MENU", customId: 'track', minValues: 0, maxValues: 2, options: [
        { value: '001', label: "O Rappa - My Brother", emoji: '♾' },
        { value: '002', label: "Salvatore Ganacci - Heartbass (feat. Tommy Cash) [Official Audio]", emoji: '▶️' },
      ] },
    ]},
    {type: "ACTION_ROW", components: [
      { type: "BUTTON", customId: 'prev', style: "PRIMARY", label: "Prev", disabled: true },
      { type: "BUTTON", customId: 'next', style: "PRIMARY", label: "Next" },
    ]},
  ];

  interaction.editReply({ content: "/** TODO: add embed */", components });
});
