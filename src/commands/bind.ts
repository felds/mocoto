import { embedComponent, Gatekeeper } from "@itsmapleleaf/gatekeeper";
import assert from "assert/strict";
import { ApplicationCommandData, TextChannel } from "discord.js";
import { setPref } from "../prefs";
import { addCommandHandler, registerCommand } from "../util/discord";
import { createBaseEmbed } from "../util/message";

export default function bindCommand(gatekeeper: Gatekeeper) {
  gatekeeper.addSlashCommand({
    name: "bind",
    description: "Show bot messages in a specific channel.",
    options: {
      channel: {
        type: "CHANNEL",
        channelTypes: ["GUILD_TEXT"],
        description: "The channel in which show the bot messages",
        required: true,
      },
    },
    async run(interaction) {
      assert(interaction.guild);

      const guild = interaction.guild;
      const channel = interaction.options.channel as TextChannel;

      await setPref(guild.id, "textChannelId", channel.id);

      const embed = createBaseEmbed().setDescription(
        `From now on, I'll only speak on **${channel}**.`,
      );

      interaction.ephemeralReply(() => [embedComponent(embed)]);
    },
  });
}
