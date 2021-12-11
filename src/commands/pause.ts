import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import assert from "assert/strict";
import { getQueue } from "../player/queue";
import { createBaseEmbed } from "../util/message";

export default function pauseCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "pause",
    description: "Pause a track if it's playing.",
    async run(context) {
      const guild = context.guild;
      assert(guild);

      const queue = getQueue(guild.id);
      if (queue.isPlaying()) {
        queue.pause();
      }

      const embed = createBaseEmbed().setDescription(":ok_hand:");
      context.ephemeralReply(() => [embedComponent(embed)]);
    },
  });
}
