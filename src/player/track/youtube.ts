import ytdl, {
  chooseFormatOptions as ChooseFormatOptions,
  videoFormat as VideoFormat,
  videoInfo as VideoInfo,
} from "ytdl-core";
import { msToDuration } from "../../util/string";
import type { Track } from "../track";

export class YoutubeTrack implements Track {
  private format: VideoFormat;

  private static formatOptions: ChooseFormatOptions = {
    quality: "highestaudio",
  };

  constructor(private info: VideoInfo) {
    this.format = ytdl.chooseFormat(
      this.info.formats,
      YoutubeTrack.formatOptions,
    );
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
    return ytdl(this.url, YoutubeTrack.formatOptions);
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
