import { ApplicationCommandData, TextChannel } from "discord.js";
import { setPref } from "../prefs";
import { addCommandHandler, registerCommand } from "../util/discord";
import { createBaseEmbed } from "../util/message";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "bind",
  description: "Show bot messages in a specific channel.",
  options: [
    {
      name: "channel",
      required: true,
      description: "The channel in which show the bot messages",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
  ],
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const guildId = interaction.guildId;
  const channel = interaction.options.getChannel("channel") as TextChannel;

  await setPref(guildId, "textChannelId", channel.id);

  const embed = createBaseEmbed().setDescription(
    `From now on, I'll only speak on **${channel}**.`,
  );

  interaction.reply({
    ephemeral: true,
    embeds: [embed],
  });
});
