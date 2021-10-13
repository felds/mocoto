import { Readable } from "stream";
import ytdl from "ytdl-core";
import y from "ytdl-core";

export interface Track {
  toString(): string;
  getSource(): Promise<string | Readable>;
  supports(query: string): Promise<boolean>;
}

export class YoutubeTrack implements Track {
  constructor(private info: y.videoInfo) {}

  /** @todo catch errors */
  static async fromUrl(url: string) {
    const info = await y.getInfo(url);
    return new YoutubeTrack(info);
  }

  toString() {
    return this.info.videoDetails.title;
  }

  async getSource() {
    const format = ytdl.chooseFormat(this.info.formats, {
      quality: "highestaudio",
      filter: "audioonly",
    });

    return format.url;
  }

  /** @todo */
  async supports(query: string) {
    return true;
  }
}
// https://www.youtube.com/watch?v=TVaYeXGcA4E
