import { Readable } from "stream";
import y from "ytdl-core-discord";
import { createYtdl } from "../util/ytdl";

const ytdl = createYtdl();

export interface Track {
  toString(): string;
  getSource(): Promise<string | Readable>;
}

export class YoutubeDlTrack implements Track {
  title?: string;
  url?: string;

  /** @todo catch errors */
  static async fromUrl(url: string) {
    const info = await (await ytdl).getVideoInfo([url, "-f", "bestaudio"]);
    const obj = new YoutubeDlTrack();
    obj.url = info.url;
    obj.title = info.title;
    return obj;
  }

  toString() {
    if (!this.title) throw new Error(`Unknown title.`);
    return this.title;
  }

  async getSource() {
    if (!this.url) throw new Error(`Unknown URL.`);
    return y(this.url);
  }
}
