import { Track } from "./track";

export interface QueuePlugin {
  onPlay?: (params: { track: Track; guildId: string }) => void;
}
