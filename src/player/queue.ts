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

    return this.audioPlayer;
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

  private playForRealsies() {
    const currTrack = this.tracks[this.pos];
    if (!currTrack) return; // @todo throw error?

    const source = currTrack.getSource();
    const resource = createAudioResource(source, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
    });
    this.getAudioPlayer().play(resource);
  }

  public addTrack(track: Track): void {
    this.tracks.push(track);
  }

  public async play(): Promise<void> {
    const player = this.getAudioPlayer();

    switch (player.state.status) {
      case AudioPlayerStatus.Idle:
        this.playForRealsies();
        return;
      case AudioPlayerStatus.Paused:
      case AudioPlayerStatus.AutoPaused: // maybe? must check exactly how this works
        player.unpause();
        return;
    }
  }

  public pause() {
    this.getAudioPlayer().pause();
  }

  /**
   * Stops playing, move pos to the end of the queue and set as idle
   */
  public stop() {
    this.getAudioPlayer().stop();
    this.pos = this.tracks.length;
  }

  /**
   * Empties the queue and resets the pos
   */
  public clear() {
    this.tracks = [];
    this.stop();
  }

  public prev() {
    if (this.pos > 0) this.pos--;
    this.playForRealsies();
  }

  public next() {
    if (this.pos < this.tracks.length - 1) this.pos++;
    this.playForRealsies();
  }

  public isIdle() {
    return this.getAudioPlayer().state.status === AudioPlayerStatus.Idle;
  }
}

const queues = new Collection<string, Queue>();
export function getQueue(guildId: string): Queue {
  const queue = queues.get(guildId) ?? new Queue(guildId);
  queues.set(guildId, queue);

  return queue;
}
