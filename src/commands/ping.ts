import { Gatekeeper } from "@itsmapleleaf/gatekeeper";

export default function pingCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "ping",
    description: "Replies with pong.",
    async run(interaction) {
      interaction.ephemeralReply(() => ["pong! :ping_pong:"]);
    },
  });
}
