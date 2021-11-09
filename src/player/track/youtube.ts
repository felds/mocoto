import ytdl, {
  chooseFormatOptions as ChooseFormatOptions,
  videoFormat as VideoFormat,
  videoInfo as VideoInfo,
} from "ytdl-core";
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

  get duration() {
    return !this.format.isLive && this.format.approxDurationMs
      ? parseInt(this.format.approxDurationMs)
      : null;
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
