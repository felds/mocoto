import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import assert from "assert/strict";
import { getQueue } from "../player/queue";
import { createBaseEmbed } from "../util/message";
import { msToDuration } from "../util/string";

export default function nowPlayingCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "now-playing",
    description: "current track info.",
    async run(context) {
      const guild = context.guild;
      assert(guild);
      const queue = getQueue(guild.id);
      const [track, position] = queue.getTrack();

      if (!track) {
        const embed = createBaseEmbed().setDescription(
          "Not playing right now.\nUse `/play` to add tracks to the playlist.",
        );
        return context.ephemeralReply(() => [embedComponent(embed)]);
      }

      const posStr = msToDuration(position);
      const durStr = msToDuration(track.duration);

      /** @todo Create a default embed for tracks */
      const embed = createBaseEmbed().setDescription(
        `Now Playing:\n${track} - ${posStr} -- ${durStr}`,
      );
      return context.ephemeralReply(() => [embedComponent(embed)]);
    },
  });
}
