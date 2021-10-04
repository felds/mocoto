import {
  AudioPlayer,
  createAudioResource,
  getVoiceConnection,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice";
import { Collection } from "discord.js";
import { Track } from "./track";

type QueueState = "IDLE" | "PLAYING";

export class Queue {
  private tracks: Track[] = [];
  private state: QueueState = "IDLE";
  private audioPlayer: AudioPlayer | null = null;
  private pos: number = 0;

  constructor(private guildId: string) {}

  private getConnection(): VoiceConnection {
    const connection = getVoiceConnection(this.guildId);
    if (connection) return connection;
    throw new Error(`Connection not found on guild ${this.guildId}`);
  }

  private getAudioPlayer(): AudioPlayer {
    if (!this.audioPlayer) {
      this.audioPlayer = new AudioPlayer();
      this.getConnection().subscribe(this.audioPlayer);
    }

    return this.audioPlayer;
  }

  public addTrack(track: Track): void {
    this.tracks.push(track);
  }

  public play() {
    if (this.state === "IDLE" && this.tracks[this.pos]) {
      const currTrack = this.tracks[this.pos];
      const stream = currTrack.getStream();

      const resource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
      });

      this.getAudioPlayer().play(resource);

      return;
    }

    throw new Error("Whoopsie.");
  }
}

const queues = new Collection<string, Queue>();
export function getQueue(guildId: string): Queue {
  const queue = queues.get(guildId) ?? new Queue(guildId);
  queues.set(guildId, queue);

  return queue;
}
