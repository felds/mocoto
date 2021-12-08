import { ApplicationCommandData, GuildChannel, GuildMember } from "discord.js";
import {
  addCommandHandler,
  join,
  JoinError,
  registerCommand,
} from "../util/discord";
import { createBaseEmbed } from "../util/message";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "join",
  description: "Join a voice channel.",
  options: [
    {
      name: "channel",
      type: "CHANNEL",
      description: "The voice channel to join.",
      channelTypes: ["GUILD_VOICE", "GUILD_STAGE_VOICE"],
    },
  ],
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  if (!interaction.inGuild()) return;

  const member = interaction.member as GuildMember;
  const channelOption = interaction.options.getChannel(
    "channel",
  ) as GuildChannel | null;

  try {
    join(member, channelOption);

    const embed = createBaseEmbed();
    embed.setDescription("I'm in. 😎");

    interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (err) {
    if (err instanceof JoinError)
      return interaction.reply({ content: err.message, ephemeral: true });
    else throw err;
  }
});
