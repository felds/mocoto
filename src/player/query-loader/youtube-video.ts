import ytdl from "ytdl-core";
import type { QueryLoader } from "../query-loader";
import { YoutubeTrack } from "../track";

async function getTracks(query: string) {
  try {
    const info = await ytdl.getInfo(query);
    return [new YoutubeTrack(info)];
  } catch (err) {
    return null;
  }
}

const queryLoader: QueryLoader = {
  getTracks,
};
export default queryLoader;
