import { Readable } from "stream";
import { videoFormat as VideoFormat } from "ytdl-core";

export interface Track {
  /**
   * The string representation for the track
   */
  toString(): string;

  /**
   * A playable source.
   */
  getSource(): Promise<string | Readable>;

  /**
   * @todo Is this used anywhere?
   */
  getFormat(): VideoFormat;

  /**
   *
   */
  duration: string;

  /**
   * @todo redundant?
   */
  durationMs: number;

  /**
   * The web link (if any)
   */
  url?: string;

  /**
   * The track thumbnail
   */
  thumbnail?: string;
}
