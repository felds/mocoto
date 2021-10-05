import {
  AudioPlayer,
  AudioPlayerState,
  AudioPlayerStatus,
  createAudioResource,
  getVoiceConnection,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice";
import { Collection } from "discord.js";
import { Track } from "./track";

type QueueState = "IDLE" | "PLAYING" | "PAUSED";

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
      this.audioPlayer.on("stateChange", this.handleStateChange.bind(this));
      this.getConnection().subscribe(this.audioPlayer);
    }

    return this.audioPlayer;
  }

  private handleStateChange(
    oldState: AudioPlayerState,
    newState: AudioPlayerState,
  ) {
    if (newState.status === AudioPlayerStatus.Idle) {
      this.next();
    }
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

  public next() {
    console.log("Manda pra próxima");
  }

  public isIdle() {
    return this.state === "IDLE";
  }
}

const queues = new Collection<string, Queue>();
export function getQueue(guildId: string): Queue {
  const queue = queues.get(guildId) ?? new Queue(guildId);
  queues.set(guildId, queue);

  return queue;
}
