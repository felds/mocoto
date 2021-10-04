import { ApplicationCommandData } from "discord.js";
import ytdl from "ytdl-core";
import { YoutubeTrack } from "../player/track";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  name: "play",
  description: "Add a track to the playlist.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "url",
      type: "STRING",
      description: "What should I play?",
    },
  ],
};

registerCommand(command);

addCommandHandler(command, (interaction) => {
  const url = interaction.options.getString("url");

  // if (url) {
  //   const track = new YoutubeTrack(url);

  //   console.log(track);
  // }
});
