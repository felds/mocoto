import { getVoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import { Guild } from "discord.js";
import { createBaseEmbed } from "../util/message";

export default function leaveCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "leave",
    description: "Leaves the voice channel.",
    async run(context) {
      const guild = context.guild as Guild;
      const connection = getVoiceConnection(guild.id);

      const isConnected =
        connection &&
        connection.state.status !== VoiceConnectionStatus.Disconnected;
      if (!isConnected) {
        const embed = createBaseEmbed().setDescription("I'm not connected.");
        return context.ephemeralReply(() => [embedComponent(embed)]);
      }

      connection.destroy();

      const embed = createBaseEmbed().setDescription(":wave: see ya!");
      return context.ephemeralReply(() => [embedComponent(embed)]);
    },
  });
}
