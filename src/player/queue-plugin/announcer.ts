import { Message } from "discord.js";
import { noop } from "lodash";
import { client } from "../../discord";
import { getPref, unsetPref } from "../../prefs";
import { getQueue } from "../queue";
import { QueuePlugin } from "../queue-plugin";
import { Button, createMessage } from "./announcer/message";

const announcements = new Map<string, Message>();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.inGuild()) return;
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    case Button.Skip: {
      const queue = getQueue(interaction.guildId);
      queue.next();
      return;
    }
  }
});

const play: QueuePlugin["play"] = async ({ queue, track }) => {
  const { guildId } = queue;

  const textChannelId = await getPref(guildId, "textChannelId");
  if (!textChannelId) return;

  const channel = client.channels.cache.get(textChannelId);
  if (!channel || !channel.isText()) {
    // channel not resolvable (probably gone)
    await unsetPref(guildId, "textChannelId");
    return;
  }

  const currMessage = announcements.get(guildId);
  if (currMessage) {
    // delete previous announcement
    await currMessage.delete().catch(noop);
  }

  const message = await channel.send(createMessage(track));

  announcements.set(guildId, message);
};

const Announcer: QueuePlugin = {
  play,
};
export default Announcer;
