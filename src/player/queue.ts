import {
  AudioPlayer,
  AudioPlayerState,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice";
import { Collection } from "discord.js";
import { shuffle } from "../util/array";
import { SubscribableEmitter } from "../util/event";
import { QueuePlugin } from "./queue-plugin";
import Announcer from "./queue-plugin/announcer";
import ErrorReporter from "./queue-plugin/error-reporter";
import { Track } from "./track";

const MAX_MISSED_FRAMES = 1000;

export class Queue {
  private tracks: Track[] = [];
  private audioPlayer: AudioPlayer | null = null;
  private pos = 0;
  private seek = 0;
  readonly event = new SubscribableEmitter<QueuePlugin>();

  constructor(readonly guildId: string) {}

  private getConnection(): VoiceConnection {
    const connection = getVoiceConnection(this.guildId);
    if (connection) return connection;
    throw new Error(`Connection not found on guild ${this.guildId}`);
  }

  private getAudioPlayer(): AudioPlayer {
    if (!this.audioPlayer) {
      this.audioPlayer = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Stop,
          maxMissedFrames: MAX_MISSED_FRAMES,
        },
      });
      this.audioPlayer.on("stateChange", this.handleStateChange.bind(this));
      this.audioPlayer.on("error", (error) => {
        this.event.emit("error", { queue: this, error });
      });
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

  private async playForRealsies() {
    const currTrack = this.tracks[this.pos];
    if (!currTrack) {
      this.getAudioPlayer().stop();
      return;
    }

    const source = await currTrack.getSource(this.seek);
    const resource = createAudioResource(source, {
      inputType: StreamType.Opus,
      inlineVolume: true,
    });

    this.getAudioPlayer().play(resource);
    this.event.emit("play", {
      queue: this,
      track: currTrack,
    });
  }

  async addTrack(track: Track) {
    this.tracks.push(track);
  }

  getTracks(): Track[] {
    return this.tracks;
  }

  getCurrent(): number {
    return this.pos;
  }

  shuffle(next = false): void {
    const [current] = this.tracks.splice(this.pos, 1);
    if (next) {
      const nextTracks = shuffle(this.tracks.slice(this.pos));
      const history = this.tracks.slice(0, this.pos);
      this.tracks = history.concat(nextTracks);

      this.tracks.splice(this.pos, 0, current);
    } else {
      this.tracks = shuffle(this.tracks);
      this.tracks.unshift(current);
      this.pos = 0;
    }
  }

  getTrack(): [track: Track, position: number] {
    let position = 0;

    if (this.audioPlayer?.state.status == AudioPlayerStatus.Playing) {
      position = this.audioPlayer?.state.playbackDuration;
    }

    return [this.tracks[this.pos], position];
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

  async seekTo(time: number) {
    this.seek = time;
    await this.playForRealsies();
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

  public isPlaying() {
    return this.getAudioPlayer().state.status === AudioPlayerStatus.Playing;
  }

  public isPaused() {
    const { status } = this.getAudioPlayer().state;

    return (
      status === AudioPlayerStatus.Paused ||
      status === AudioPlayerStatus.AutoPaused
    );
  }

  destroy() {
    this.getConnection().destroy();
    this.clear();
  }
}

const queues = new Collection<string, Queue>();
export function getQueue(guildId: string): Queue {
  const existingQueue = queues.get(guildId);
  if (existingQueue) return existingQueue;

  const newQueue = new Queue(guildId);

  newQueue.event.addSubscriber(Announcer);
  newQueue.event.addSubscriber(ErrorReporter);

  queues.set(guildId, newQueue);
  return newQueue;
}
