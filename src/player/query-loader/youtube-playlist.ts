import { GuildMember } from "discord.js";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import type { QueryLoader } from "../query-loader";
import { YoutubeTrack } from "../track/youtube";

// @TODO allow N items
const MAX_ITEMS = 10;

async function getTracks(user: GuildMember, query: string) {
  if (!query.includes("list=")) return null;
  try {
    const playlist = await ytpl(query, { limit: MAX_ITEMS });
    return Promise.all(
      playlist.items.map(async (i) => {
        const info = await ytdl.getInfo(i.url);
        return new YoutubeTrack(user, info);
      }),
    );
  } catch (err) {
    return null;
  }
}

const queryLoader: QueryLoader = {
  getTracks,
};
export default queryLoader;
