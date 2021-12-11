import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import { GuildMember } from "discord.js";
import { join, JoinError } from "../util/discord";
import { createBaseEmbed } from "../util/message";

export default function joinCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "join",
    description: "Join a voice channel.",
    options: {
      channel: {
        type: "CHANNEL",
        description: "The voice channel to join.",
        channelTypes: ["GUILD_VOICE", "GUILD_STAGE_VOICE"],
      },
    },
    run: (context) => {
      const member = context.member as GuildMember;
      const channelOption = context.options.channel;

      try {
        join(member, channelOption);
        const embed = createBaseEmbed().setDescription("I'm in :sunglasses:");
        context.ephemeralReply(() => [embedComponent(embed)]);
      } catch (err) {
        if (err instanceof JoinError) {
          const message = err.message;
          context.ephemeralReply(() => [message]);
        } else throw err;
      }
    },
  });
}
