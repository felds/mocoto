import { AudioPlayerError } from "@discordjs/voice";
import { Queue } from "./queue";
import { Track } from "./track";

export type QueuePlugin = {
  play?(params: { queue: Queue; track: Track }): void;
  error?: (params: { queue: Queue; error: Error }) => void;
};
