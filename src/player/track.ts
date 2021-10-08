import { Readable } from "stream";
import { createYtdl } from "../util/ytdl";
import stream from "stream";

export interface Track {
  getStream(): Promise<Readable>;
}

export class YoutubeTrack implements Track {
  private title: string;

  constructor(private url: string) {
    this.title = "Parada do youtube";
  }

  toString() {
    return this.title;
  }

  async getStream() {
    const ytdl = await createYtdl();

    /** @todo catch errors when there is no opus version */
    const str: Readable = ytdl.execStream([
      this.url,
      "-f",
      "bestaudio[acodec=opus]",
      "--http-chunk-size=10485760",
    ]);

    ["close", "data", "end", "error", "pause", "readable", "resume"].forEach(
      (ev) => {
        str.on(ev, (...x) => console.log(ev, x));
      },
    );

    const pt = new stream.PassThrough(); // { highWaterMark: 1024 });
    str.pipe(pt);

    return pt;
  }
}

// https://stackoverflow.com/questions/55959479/error-err-stream-premature-close-premature-close-in-node-pipeline-stream
