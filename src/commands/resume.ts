import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import assert from "assert/strict";
import { getQueue } from "../player/queue";
import { createBaseEmbed } from "../util/message";

export default function resumeCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "resume",
    description: "Play a track if is paused.",
    async run(context) {
      const guild = context.guild;

      assert(guild);
      const queue = getQueue(guild.id);

      /** @todo check connection */

      if (queue.isPaused()) {
        queue.play();
      }

      const embed = createBaseEmbed().setDescription(":ok:");
      return context.ephemeralReply(() => [embedComponent(embed)]);
    },
  });
}
