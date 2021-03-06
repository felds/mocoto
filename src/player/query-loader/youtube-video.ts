import { GuildMember } from "discord.js";
import ytdl from "ytdl-core";
import type { QueryLoader } from "../query-loader";
import { YoutubeTrack } from "../track/youtube";

async function getTracks(user: GuildMember, query: string) {
  try {
    const info = await ytdl.getInfo(query);
    return [new YoutubeTrack(user, info)];
  } catch (err) {
    return null;
  }
}

const queryLoader: QueryLoader = {
  getTracks,
};
export default queryLoader;
