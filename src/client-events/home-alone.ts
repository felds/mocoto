import { getVoiceConnection } from "@discordjs/voice";
import { VoiceState } from "discord.js";
import { clearTimeout, setTimeout } from "timers";
import { getQueue, Queue } from "../player/queue";

const DELAY = 30_000;

const timeouts = new Map<Queue, NodeJS.Timeout>();

/**
 * @todo abort timeout sometimes.
 */
export async function homeAlone(
  oldState: VoiceState,
  newState: VoiceState,
): Promise<void> {
  // state change doesn't have a member or it's a bot
  const member = oldState.member;
  if (!member || member.user.bot) return;

  // user is not changing channels
  if (!oldState.channel || oldState.channel === newState.channel) return;

  // mocoto is not connected to the affected channel
  const guild = oldState.guild;
  const conn = getVoiceConnection(guild.id);
  if (!conn || conn.joinConfig.channelId !== oldState.channelId) return;

  // there are still non-bot users in the channel
  const channel = oldState.channel;
  const members = channel.members;
  if (!members.every((m) => m.user.bot)) return;

  const queue = getQueue(guild);
  const ts = timeouts.get(queue);
  if (ts) {
    clearTimeout(ts);
    timeouts.delete(queue);
  }

  function disconnect() {
    /*noop*/
  }

  timeouts.set(queue, setTimeout(disconnect, DELAY));
}
