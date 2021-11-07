import { ApplicationCommandData, TextChannel } from "discord.js";
import { getBot } from "../bot";
import { addCommandHandler, registerCommand } from "../util/discord";

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

  // console.log(guildId, channel);

  const bot = getBot(guildId);
  bot.textChannel = channel;

  interaction.reply("ok");
});