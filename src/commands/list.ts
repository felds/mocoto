import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import assert from "assert/strict";
import { getQueue } from "../player/queue";
import { createBaseEmbed } from "../util/message";
import { msToDuration } from "../util/string";

/** @todo Add prev/next page buttons. */
export default function listCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "list",
    description: "List tracks.",
    async run(context) {
      const guild = context.guild;
      assert(guild);

      const queue = getQueue(guild.id);
      const current = queue.getCurrent();
      const list = queue.getTracks();

      if (!list.length) {
        const embed = createBaseEmbed().setDescription("The queue is empty");
        return context.ephemeralReply(() => [embedComponent(embed)]);
      }

      const lines = list
        .map((track, i) => {
          const duration = msToDuration(track.duration);
          if (i - current < -2) return null; /** @xx wtf? */

          const index = String(i - current).padStart(2, "0");
          const user = track.userRef?.deref();
          let usertext = "";
          if (user) usertext = `from (${user})`;
          const trackTitle =
            String(track).length > 30
              ? String(track).substring(0, 30) + "..."
              : track;
          return `**${index}** \`${trackTitle} -- (${duration})\`${usertext}`;
        })
        .filter((x) => x != null);

      const embed = createBaseEmbed()
        .setTitle(`Tracks (${current} - ${list.length})`)
        .setDescription(lines.join("\n"));

      context.ephemeralReply(() => [embedComponent(embed)]);
    },
  });
}
