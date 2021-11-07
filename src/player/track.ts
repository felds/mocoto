import { stringify } from "querystring";
import { Readable } from "stream";
import ytdl from "ytdl-core";
import { msToDuration } from "../util/string";
export interface Track {
  toString(): string;
  getSource(): Promise<string | Readable>;
  supports(query: string): Promise<boolean>;
  getFormat(): ytdl.videoFormat;
  duration: string;
  durationMs: number;
  url: string;
  thumbnail: string;
}

export class YoutubeTrack implements Track {
  private format: ytdl.videoFormat;

  constructor(private info: ytdl.videoInfo) {
    this.format = ytdl.chooseFormat(this.info.formats, {
      quality: "highestaudio",
      filter: "audioonly",
    });
  }

  /** @todo catch errors */
  static async fromUrl(url: string) {
    const info = await ytdl.getInfo(url);
    return new YoutubeTrack(info);
  }

  toString() {
    return this.info.videoDetails.title;
  }

  async getSource() {
    return this.format.url;
  }

  getFormat() {
    return this.format;
  }

  get durationMs() {
    return this.format?.approxDurationMs
      ? parseInt(this.format.approxDurationMs)
      : 0;
  }

  get duration() {
    return msToDuration(this.durationMs);
  }

  /** @todo */
  async supports(query: string) {
    return true;
  }

  get url() {
    return this.info.videoDetails.video_url;
  }

  get thumbnail() {
    return this.info.videoDetails.thumbnails?.[0].url;
  }
}
// https://www.youtube.com/watch?v=TVaYeXGcA4E
