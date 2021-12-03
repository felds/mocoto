import { MessageEmbed } from "discord.js";
import { client } from "../../discord";
import { getPref, unsetPref } from "../../prefs";
import { createBaseEmbed } from "../../util/message";
import { QueuePlugin } from "../queue-plugin";

const error: QueuePlugin["error"] = async ({ queue, error }) => {
  const { guildId } = queue;

  const textChannelId = await getPref(guildId, "textChannelId");
  if (!textChannelId) return;

  const channel = client.channels.cache.get(textChannelId);
  if (!channel || !channel.isText()) {
    // channel not resolvable (probably gone)
    await unsetPref(guildId, "textChannelId");
    return;
  }

  await channel.send({
    embeds: [createEmbed(error)],
  });
};

const ErrorReporter: QueuePlugin = {
  error,
};
export default ErrorReporter;

/* ====================================================== */
function createEmbed(error: Error): MessageEmbed {
  const embed = createBaseEmbed();

  embed.setDescription(
    "There was a ploblem playing the current track. Skipping...",
  );
  embed.addField("Message", `\`${error.message}\``);

  return embed;
}
