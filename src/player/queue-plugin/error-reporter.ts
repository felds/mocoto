import { MessageEmbed } from "discord.js";
import { noop, sample } from "lodash";
import { client } from "../../discord";
import { getPref, unsetPref } from "../../prefs";
import { createBaseEmbed } from "../../util/message";
import { QueuePlugin } from "../queue-plugin";
import axios from "axios";

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

  const embed = await createEmbed(error);

  await channel.send({
    embeds: [embed],
  });
};

async function createEmbed(error: Error): Promise<MessageEmbed> {
  const embed = createBaseEmbed();

  embed.setDescription(
    "There was a ploblem playing the current track. Skipping...",
  );

  await randomGif()
    .then((gif) => embed.setImage(gif))
    .catch(noop);

  return embed;
}

async function randomGif(): Promise<string> {
  const count = 100;
  const { data } = await axios.get("https://api.gfycat.com/v1/gfycats/search", {
    params: { search_text: "sobbing", count },
  });
  return sample(data.gfycats).gifUrl;
}

const ErrorReporter: QueuePlugin = {
  error,
};
export default ErrorReporter;
