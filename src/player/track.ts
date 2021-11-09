import { GuildMember } from "discord.js";
import { Readable } from "stream";

export interface Track {
  /**
   * The string representation for the track.
   */
  toString(): string;

  /**
   * A playable source.
   */
  getSource(): Promise<string | Readable>;

  /**
   * The duration of the track in milliseconds. `null` if live.
   */
  readonly duration: number | null;

  /**
   * The web link (if any).
   */
  readonly url?: string;

  /**
   * The track thumbnail.
   */
  readonly thumbnail?: string;

  /**
   * The user who added the track.
   */
  readonly userRef: WeakRef<GuildMember> | null;
}
