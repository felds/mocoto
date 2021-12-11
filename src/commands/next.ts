import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import assert from "assert/strict";
import { getQueue } from "../player/queue";
import { createBaseEmbed } from "../util/message";

export default function nextCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "next",
    description: "Skips the current track.",
    async run(context) {
      const guild = context.guild;
      assert(guild);
      const queue = getQueue(guild.id);

      queue.next();

      const embed = createBaseEmbed().setDescription("Here it goes");
      context.ephemeralReply(() => [embedComponent(embed)]);
    },
  });
}
