import { Queue } from "./queue";
import { Track } from "./track";

export interface QueuePlugin {
  onPlay?: (params: { queue: Queue; track: Track; guildId: string }) => void;
}
