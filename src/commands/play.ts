import { getVoiceConnection } from "@discordjs/voice";
import { ApplicationCommandData, GuildMember, MessageEmbed } from "discord.js";
import { getQueue } from "../player/queue";
import { Track, YoutubeTrack } from "../player/track";
import { addCommandHandler, join, registerCommand } from "../util/discord";
import ytdl from "ytdl-core";

const command: ApplicationCommandData = {
  name: "play",
  description: "Add a track to the playlist.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "url",
      type: "STRING",
      description: "What should I play?",
      required: true,
    },
  ],
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const member = interaction.member as GuildMember;
  const guild = interaction.guild!;
  const queue = getQueue(guild.id);

  /** @fixme When "disconnected" with leave, getVoiceConnection still returns a connection. */
  const connection = getVoiceConnection(guild.id);
  if (!connection) {
    join(member);
  }

  const url = interaction.options.getString("url");
  if (url) {
    await interaction.deferReply({ ephemeral: true });

    const track = await YoutubeTrack.fromUrl(url);
    queue.addTrack(track);

    if (queue.isIdle()) {
      queue.play();
    }

    const embed = createEmbed(member, track);
    await interaction.editReply({
      embeds: [embed],
    });
  }

  interaction.replied || interaction.reply({ content: "👌", ephemeral: true });

  countSecs();
});

let secs = 0;
function countSecs() {
  console.log("secs", secs++);
  setTimeout(countSecs, 1000);
}

function createEmbed(
  author: GuildMember,
  track: Track,
): MessageEmbed {
 
  const embed = new MessageEmbed()
    .setColor(0xed9420)
    .setDescription([`${author} added a new track:`, `**${track}**`].join("\n"))
    .setFields([
      {
        name: "Link",
        value: "https://www.youtube.com/watch?v=5yx6BWlEVcY",
      },
      {
        name: "Duration",
        value: track.duration,
      },
    ])
    .setThumbnail(
      "https://i.ytimg.com/vi/5yx6BWlEVcY/hq720_live.jpg?sqp=CLTTmIsG-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB_pVK3jR5yufoubu0lTW2C0Gud4Q",
    )
    .setURL("https://www.youtube.com/watch?v=5yx6BWlEVcY")
    .setFooter("Help me improve: https://github.com/felds/mocoto");

  return embed;
}
