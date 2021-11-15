import { GuildMember } from "discord.js";
import {
  chooseFormatOptions as ChooseFormatOptions,
  videoFormat as VideoFormat,
  videoInfo as VideoInfo,
} from "ytdl-core";
import ytdl from "discord-ytdl-core";
import type { Track } from "../track";

export class YoutubeTrack implements Track {
  private format: VideoFormat;

  readonly userRef: WeakRef<GuildMember>;

  private static formatOptions: ChooseFormatOptions = {
    quality: "highestaudio",
  };

  constructor(user: GuildMember, private info: VideoInfo) {
    this.format = ytdl.chooseFormat(
      this.info.formats,
      YoutubeTrack.formatOptions,
    );
    this.userRef = new WeakRef(user);
  }

  toString() {
    return this.info.videoDetails.title;
  }

  get title() {
    return this.info.videoDetails.title;
  }

  async getSource(seek = 0) {
    return ytdl(this.url, {
      ...YoutubeTrack.formatOptions,
      seek,
      opusEncoded: true,
    });
  }

  get duration() {
    return !this.format.isLive && this.format.approxDurationMs
      ? parseInt(this.format.approxDurationMs)
      : null;
  }

  get url() {
    return this.info.videoDetails.video_url;
  }

  get thumbnail() {
    return this.info.videoDetails.thumbnails?.[0].url;
  }
}
