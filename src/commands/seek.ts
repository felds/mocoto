import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import assert from "assert/strict";
import { getQueue } from "../player/queue";
import { createBaseEmbed } from "../util/message";

/**
 * @todo parse times in the formats: 1m23s, 1h23m45s, 1h45s, 123s 1:23 1:23:45.
 *    every timestamp should be combined with + or -
 *    to go forwards and backwards from the current position.
 */
export default function seekCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "seek",
    description: "Go to a specific timestamp in a track.",
    options: {
      time: {
        type: "STRING",
        description:
          "A timestamp to go to. Combine with +/- to go forwards/backwards from the current position.",
        required: true,
      },
    },
    async run(context) {
      const guild = context.guild;
      assert(guild);

      /** @todo check connection */

      const queue = getQueue(guild.id);
      const [track] = queue.getTrack();
      if (!track) {
        const embed = createBaseEmbed().setDescription("No track to seek.");
        return context.ephemeralReply(() => [embedComponent(embed)]);
      }

      const time = parseInt(context.options.time);
      if (isNaN(time)) {
        const embed = createBaseEmbed().setDescription("Invalid time.");
        return context.ephemeralReply(() => [embedComponent(embed)]);
      }

      await queue.seekTo(time);

      const embed = createBaseEmbed().setDescription(
        "✅ sought to, ${seekTo} of ${duration}`",
      );
      return context.ephemeralReply(() => [embedComponent(embed)]);
    },
  });
}
