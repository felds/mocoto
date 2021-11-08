import { Track } from "./track";

import YoutubePlaylistLoader from "./query-loader/youtube-playlist";
import YoutubeVideoLoader from "./query-loader/youtube-video";

export interface QueryLoader {
  /**
   * Get tracks for the query
   * @param query
   */
  getTracks(query: string): Promise<Track[] | null>;
}

export async function loadTracks(query: string): Promise<Track[] | null> {
  const loaderChain = [YoutubePlaylistLoader, YoutubeVideoLoader];

  console.log(loaderChain);

  for (const loader of loaderChain) {
    const tracks = await loader.getTracks(query);
    if (tracks !== null) return tracks;
  }
  return null;
}
