import { Track } from "./track";

import YoutubePlaylistLoader from "./query-loader/youtube-playlist";
import YoutubeVideoLoader from "./query-loader/youtube-video";
import { GuildMember } from "discord.js";

export interface QueryLoader {
  /**
   * Get tracks for the query
   * @param query
   * @param user The user adding the tracks.
   */
  getTracks(user: GuildMember, query: string): Promise<Track[] | null>;
}

export async function loadTracks(
  user: GuildMember,
  query: string,
): Promise<Track[] | null> {
  const loaderChain = [YoutubePlaylistLoader, YoutubeVideoLoader];

  for (const loader of loaderChain) {
    const tracks = await loader.getTracks(user, query);
    if (tracks !== null) return tracks;
  }
  return null;
}
