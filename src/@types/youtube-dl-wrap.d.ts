module "youtube-dl-wrap" {
  export default class YoutubeDlWrap {
    constructor(filename: string);

    static downloadFromGithub(filename: string): Promise<void>;

    async getVideoInfo(args: string | string[]): any;

    execStream(
      youtubeDlArguments: string[],
      options?: stream.SpawnOptions,
      abortSignal?: AbortSignal,
    ): Readable;
  }
}
