import assert from "assert/strict";
import { Gatekeeper } from "@itsmapleleaf/gatekeeper";
import { getQueue } from "../player/queue";

/** @todo Add embeds */
export default function shuffleAllCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "shuffle-all",
    description: "shuffle all tracks.",
    async run(context) {
      const guild = context.guild;
      assert(guild);

      const queue = getQueue(guild.id);

      /** @todo rename to `tracks` */
      const list = queue.getTracks();
      if (!list.length) {
        return context.ephemeralReply(() => `No tracks to shuffle`);
      }

      queue.shuffle();
      return context.ephemeralReply(() => `Shuffled!`);
    },
  });
}
