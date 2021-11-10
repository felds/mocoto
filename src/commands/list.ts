import { ApplicationCommandData, GuildMember } from "discord.js";
import { getQueue } from "../player/queue";
import { Track } from "../player/track";
import { addCommandHandler, registerCommand } from "../util/discord";
import { createBaseEmbed } from "../util/message";
import { msToDuration } from "../util/string";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "list",
  description: "List tracks.",
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const guild = interaction.guild!;
  const queue = getQueue(guild.id);
  const [list, current] = queue.getTracks();

  if (!list.length) {
    await interaction.reply({ content: "No Tracks", ephemeral: true });
    return;
  }

  const lines = list.map((track, i) => {
    const duration = msToDuration(track.duration);

    const sign = Math.sign(i - current);
    const index =
      sign < 0 ? "-" : "" + String(Math.abs(i - current)).padStart(2, "0");

    const user = track.userRef?.deref();
    let usertext = "";
    if (user) usertext = `from (${user})`;
    const trackTitle =
      String(track).length > 30
        ? String(track).substring(0, 30) + "..."
        : track;

    return `**${index}** \`${trackTitle} -- (${duration})\`${usertext}`;
  });

  const embed = createBaseEmbed();
  embed.setTitle("Tracks");
  embed.setDescription(lines.join("\n"));

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
});
