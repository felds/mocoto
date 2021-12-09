import {
  ApplicationCommandData,
  CollectorFilter,
  Emoji,
  Message,
  MessageActionRow,
  MessageOptions,
  ReactionEmoji,
  SelectMenuInteraction,
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
  await interaction.deferReply();

  await setTimeout(100);

  let page = 0;

  // prettier-ignore
  const reply = (await interaction.editReply({
    content: "e aí? o que vai ser",
    components: buildComponents(page, 5),
  })) as Message;

  try {
    for (;;) {
      const componentInteraction = await reply.awaitMessageComponent({});
      switch (componentInteraction.customId) {
        case "prev":
          {
            page--;
            componentInteraction.update({
              content: `Página ${page}`,
              components: buildComponents(page, 5),
            });
          }
          break;
        case "next":
          {
            page++;
            componentInteraction.update({
              content: `Página ${page}`,
              components: buildComponents(page, 5),
            });
          }
          break;
      }
    }
  } catch (err) {
    if (err instanceof Error)
      console.log("err while awaiting for interactions", err);
  }

  // // prettier-ignore
  // const components: MessageOptions['components'] =
  // [
  //   {type: "ACTION_ROW", components: [
  //     { type: "SELECT_MENU", customId: 'track', minValues: 0, maxValues: 2, options: [
  //       { value: 'rappa', label: "O Rappa - My Brother", emoji: '♾' },
  //       { value: 'salva', label: "Salvatore Ganacci - Heartbass (feat. Tommy Cash) [Official Audio]", emoji: '▶️' },
  //     ] },
  //   ]},
  //   {type: "ACTION_ROW", components: [
  //     { type: "BUTTON", customId: 'prev', style: "PRIMARY", label: "Prev", disabled: true },
  //     { type: "BUTTON", customId: 'next', style: "PRIMARY", label: "Next" },
  //   ]},
  // ];
});

function buildComponents(
  page: number,
  numPages: number,
): MessageOptions["components"] {
  return [
    {
      type: "ACTION_ROW",
      components: [
        {
          type: "BUTTON",
          customId: "prev",
          label: "Prev",
          style: "SUCCESS",
          disabled: page < 1,
        },
        {
          type: "BUTTON",
          customId: "next",
          label: "Next",
          style: "SUCCESS",
          disabled: page >= numPages,
        },
      ],
    },
  ];
}
