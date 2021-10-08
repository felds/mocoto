import { Readable } from "stream";
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
    return y.downloadFromInfo(this.info, {
      filter: "audioonly",
      dlChunkSize: 0,
    });
  }

  /** @todo */
  async supports(query: string) {
    return true;
  }
}
