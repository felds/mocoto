import { Collection, TextChannel } from "discord.js";

/**
 * @todo put queue in here
 */
export default class Bot {
  public textChannel: TextChannel | null = null;
}

const bots = new Collection<string, Bot>();
export function getBot(guildId: string): Bot {
  const bot = bots.get(guildId) ?? new Bot();
  bots.set(guildId, bot);
  return bot;
}
