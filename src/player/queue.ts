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

export class Queue {
  private tracks: Track[] = [];
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

    return this.audioPlayer.;
  }

  private handleStateChange(
    oldState: AudioPlayerState,
    newState: AudioPlayerState,
  ) {
    if (newState.status === AudioPlayerStatus.Idle) {
      this.pos++;
      this.play();
      return;
    }
  }

  private async playForRealsies() {
    const currTrack = this.tracks[this.pos];
    if (!currTrack) {
      this.getAudioPlayer().stop();
      return;
    }

    const source = await currTrack.getSource();
    const resource = createAudioResource(source, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
    });
    this.getAudioPlayer().play(resource);
  }

  async addTrack(track: Track) {
    this.tracks.push(track);
  }

  async play() {
    const player = this.getAudioPlayer();

    switch (player.state.status) {
      case AudioPlayerStatus.Idle:
        await this.playForRealsies();
        return;
      case AudioPlayerStatus.Paused:
      case AudioPlayerStatus.AutoPaused: // maybe? must check exactly how this works
        player.unpause();
        return;
    }
  }

  async pause() {
    this.getAudioPlayer().pause();
  }

  /**
   * Stops playing, move pos to the end of the queue and set as idle
   */
  async stop() {
    this.getAudioPlayer().stop();
    this.pos = this.tracks.length;
  }

  /**
   * Empties the queue and resets the pos
   */
  async clear() {
    this.tracks = [];
    this.stop();
  }

  async prev() {
    if (this.pos > 0) this.pos--;
    await this.playForRealsies();
  }

  async next() {
    if (this.pos < this.tracks.length) this.pos++;
    await this.playForRealsies();
  }

  isIdle() {
    return this.getAudioPlayer().state.status === AudioPlayerStatus.Idle;
  }

  public isPlayng() {
    return this.getAudioPlayer().state.status === AudioPlayerStatus.Playing;
  }
}

const queues = new Collection<string, Queue>();
export function getQueue(guildId: string): Queue {
  const queue = queues.get(guildId) ?? new Queue(guildId);
  queues.set(guildId, queue);

  return queue;
}
