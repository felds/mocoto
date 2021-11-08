import { Track } from "./track";

export interface QueryLoader {
  /**
   * Get tracks for the query
   * @param query
   */
  getTracks(query: string): Promise<Track[] | null>;
}

export async function loadTracks(query: string): Promise<Track[] | null> {
  const loaderChain = [
    (await import("./query-loader/youtube-playlist")).default,
  ] as QueryLoader[];

  console.log(loaderChain);

  for (const loader of loaderChain) {
    const tracks = await loader.getTracks(query);
    if (tracks !== null) return tracks;
  }
  return null;
}
