import { AudioPlayerError } from "@discordjs/voice";
import { Queue } from "./queue";
import { Track } from "./track";

export interface QueuePlugin {
  onPlay?: (params: { queue: Queue; track: Track; guildId: string }) => void;
  onError?: (params: { queue: Queue; error: AudioPlayerError }) => void;
}
