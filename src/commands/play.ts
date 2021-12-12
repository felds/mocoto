import { getVoiceConnection } from "@discordjs/voice";
import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import assert from "assert/strict";
import { MessageEmbed } from "discord.js";
import { loadTracks } from "../player/query-loader";
import { getQueue } from "../player/queue";
import { Track } from "../player/track";
import { join } from "../util/discord";
import { createBaseEmbed } from "../util/message";
import { msToDuration } from "../util/string";

export default function playCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "play",
    description: "Add a track to the playlist.",
    options: {
      url: {
        type: "STRING",
        description: "Something to play",
        required: true,
      },
    },
    async run(context) {
      const member = context.member;
      assert(member);
      const guild = context.guild;
      assert(guild);

      const queue = getQueue(guild.id);

      /** @fixme When "disconnected" with leave, getVoiceConnection still returns a connection. */
      const connection = getVoiceConnection(guild.id);
      if (!connection) {
        join(member);
      }

      const { url } = context.options;
      context.ephemeralDefer();

      const tracks = await loadTracks(member, url);
      if (tracks) {
        for (const track of tracks) queue.addTrack(track);

        const embedComponents = tracks.map((track) => {
          const embed = createEmbed(track);
          return embedComponent(embed);
        });

        context.ephemeralReply(() => [...embedComponents]);
      } else {
        /** @todo add better embed */
        context.ephemeralReply(() => "Track not found");
      }

      if (queue.isIdle() || queue.isPaused()) {
        queue.play();
      }
    },
  });
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
