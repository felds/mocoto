import ytdl from "ytdl-core";
import { Readable } from "stream";

export interface Track {
  getStream(): Readable;
}

export class YoutubeTrack implements Track {
  private title: string;

  constructor(private url: string) {
    this.title = "Parada do youtube";
  }

  toString() {
    return this.title;
  }

  getStream(): Readable {
    return ytdl(this.url, { filter: "audioonly" });
  }
}
