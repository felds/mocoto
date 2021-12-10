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
import { YTSearch } from "../../util/yt-search";
import ytsr from "ytsr";

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

  const query = interaction.options.getString("query")!;

  let page = 0;
  const search = new YTSearch(query, 10);
  await search.load();

  // prettier-ignore
  const reply = (await interaction.editReply({
    content: "e aí? o que vai ser",
    components: await buildComponents(page, search),
  })) as Message;

  try {
    for (;;) {
      const componentInteraction = await reply.awaitMessageComponent({});
      componentInteraction.deferUpdate();
      switch (componentInteraction.customId) {
        case "prev":
          {
            page--;
            const results = await search.page(page);
            componentInteraction.update({
              content: `Página ${page}`,
              components: await buildComponents(page, search),
            });
          }
          break;
        case "next":
          {
            page++;
            const results = await search.page(page);
            componentInteraction.update({
              content: `Página ${page}`,
              components: await buildComponents(page, search),
            });
          }
          break;
        case "track":
          {
            assert(componentInteraction.isSelectMenu());
            console.log("Adicionando vídeos", componentInteraction.values);
          }
          break;
      }
    }
  } catch (err) {
    if (err instanceof Error)
      console.log("err while awaiting for interactions", err);
  }
});

async function buildComponents(
  page: number,
  search: YTSearch,
): Promise<MessageOptions["components"]> {
  const results = await search.page(page);
  assert(search.pages);

  return [
    {
      type: "ACTION_ROW",
      components: [
        {
          type: "SELECT_MENU",
          customId: "track",
          minValues: 0,
          maxValues: results.length,
          options: results.map((r) => ({
            /** @todo better labels */
            label: r.title,
            description: r.author?.name,
            value: r.url,
          })),
        },
      ],
    },
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
          disabled: page >= search.pages,
        },
        {
          type: "BUTTON",
          customId: "fix",
          label: `Did you mean: Jorge`,
          style: "SECONDARY",
        },
      ],
    },
  ];
}
