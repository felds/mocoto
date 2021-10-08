import { Readable } from "stream";
import y from "ytdl-core";

const MB = 1_048_576; // 1MB = 1024**2

export interface Track {
  toString(): string;
  getSource(): Promise<string | Readable>;
}

export class YoutubeDlTrack implements Track {
  constructor(private info: y.videoInfo) {}

  /** @todo catch errors */
  static async fromUrl(url: string) {
    const info = await y.getInfo(url);
    return new YoutubeDlTrack(info);
  }

  toString() {
    return this.info.videoDetails.title;
  }

  async getSource() {
    return y.downloadFromInfo(this.info, {
      filter: "audioonly",
      dlChunkSize: 0,
      // dlChunkSize: 0.5 * MB,
      // highWaterMark: 0.25 * MB,
    });
  }
}
