import { MessageOptions, MessageEmbed } from "discord.js";
import { createBaseEmbed } from "../../../util/message";
import { msToDuration } from "../../../util/string";
import { Track } from "../../track";

export enum Button {
  Skip = "announcer__skip",
  StartOver = "announcer__startover",
}

export function createMessage(track: Track): MessageOptions {
  return {
    embeds: [createEmbed(track)],
    components: [
      {
        type: "ACTION_ROW",
        components: [
          {
            customId: Button.StartOver,
            type: "BUTTON",
            style: "PRIMARY",
            label: "Start over",
            disabled: true,
          },
          {
            customId: Button.Skip,
            type: "BUTTON",
            style: "PRIMARY",
            label: "Skip",
          },
        ],
      },
    ],
  };
}

function createEmbed(track: Track): MessageEmbed {
  const embed = createBaseEmbed();

  const author = track.userRef?.deref();
  if (author) {
    embed.setDescription(`${author} added a new track:\n**${track}**`);
  } else {
    embed.setDescription(`**${track}**`);
  }

  if (track.url) {
    embed.addField("Url", track.url);
    embed.setURL(track.url);
  }

  embed.addField("Duration", msToDuration(track.duration));

  if (track.thumbnail) {
    embed.setThumbnail(track.thumbnail);
  }

  return embed;
}
