import ytdl from "ytdl-core";

export interface Track {
  getStream(): NodeJS.ReadableStream;
}

export class YoutubeTrack implements Track {
  private title: string | null = null;

  constructor(private url: string) {
    this.title = "Parada do youtube";
  }

  getStream(): NodeJS.ReadableStream {
    const stream = ytdl(this.url, { filter: "audioonly" });
    return stream;
  }
}
