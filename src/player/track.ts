import { Readable } from "stream";
import ytdl from "ytdl-core";
import y from "ytdl-core";

export interface Track {
  toString(): string;
  getSource(): Promise<string | Readable>;
  supports(query: string): Promise<boolean>;
  getFormat(): ytdl.videoFormat;
  duration: string;
  durationMs: number;
}

export class YoutubeTrack implements Track {
  private format: ytdl.videoFormat;

  constructor(private info: y.videoInfo) {
    this.format = info.formats[0];
  }

  /** @todo catch errors */
  static async fromUrl(url: string) {
    const info = await y.getInfo(url);
    console.log(info);

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

  getFormat() {
    return this.format;
  }
  
  get durationMs(){
   return this.format?.approxDurationMs ? parseInt(this.format.approxDurationMs) : 0
  }

  get duration() {
    
    if (!this.durationMs) {
      return "♾️ live";
    }
    const date = new Date(this.durationMs);
    const HH = `${date.getUTCHours()}`.padStart(2, "0");
    const MM = `${date.getUTCMinutes()}`.padStart(2, "0");
    const SS = `${date.getUTCSeconds()}`.padStart(2, "0");

    return `${HH}:${MM}:${SS}`;
  }

  /** @todo */
  async supports(query: string) {
    return true;
  }
}
// https://www.youtube.com/watch?v=TVaYeXGcA4E
