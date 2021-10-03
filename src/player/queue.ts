import {
  AudioPlayer,
  createAudioResource,
  getVoiceConnection,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice";
import { Guild } from "discord.js";
import ytdl from "ytdl-core";

type Track = {
  url: string;
  title: string;
};

type QueueState = "IDLE" | "PLAYING";

export class Queue {
  private tracks: Track[] = [];
  private state: QueueState = "IDLE";
  private audioPlayer: AudioPlayer | null = null;
  private pos: number = 0;

  constructor(private guild: Guild) {}

  private getConnection(): VoiceConnection {
    const connection = getVoiceConnection(this.guild.id);
    if (connection) return connection;
    throw new Error(`Connection not found on guild ${this.guild.name}`);
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
      const stream = ytdl(currTrack.url, { filter: "audioonly" });

      const resource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
      });

      this.getAudioPlayer().play(resource);

      return;
    }

    throw new Error("Whoopsie.");
  }
}

// const q = new Queue(voiceChannel.guild);
// q.addTrack({
//   url: "https://www.youtube.com/watch?v=5yx6BWlEVcY",
//   title: "Chillhop Radio - jazzy & lofi hip hop beats 🐾",
// });
// q.play();
