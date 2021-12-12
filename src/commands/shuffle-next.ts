import { Gatekeeper } from "@itsmapleleaf/gatekeeper";
import assert from "assert";
import { getQueue } from "../player/queue";

export default function shuffleNextCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "shuffle-next",
    description: "shuffle only upcoming tracks.",
    async run(context) {
      const guild = context.guild;
      assert(guild);

      const queue = getQueue(guild.id);
      const list = queue.getTracks();

      if (!list.length) {
        return context.ephemeralReply(() => `No tracks to shuffle`);
      }

      queue.shuffle(true);
      return context.ephemeralReply(() => `Shuffled!`);
    },
  });
}
