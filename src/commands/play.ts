import { getVoiceConnection } from "@discordjs/voice";
import { ApplicationCommandData, GuildMember, MessageEmbed } from "discord.js";
import { loadTracks } from "../player/query-loader";
import { getQueue } from "../player/queue";
import { Track } from "../player/track";
import { addCommandHandler, join, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  name: "play",
  description: "Add a track to the playlist.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "query",
      type: "STRING",
      description: "Something to search",
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

  const query = interaction.options.getString("query");
  if (query) {
    await interaction.deferReply({ ephemeral: true });

    const tracks = await loadTracks(query);
    if (tracks) {
      const embeds = tracks.map((track) => {
        queue.addTrack(track);
        return createEmbed(member, track);
      });

      await interaction.editReply({
        embeds,
      });
    } else {
      // @TODO better message/embed
      interaction.editReply("Track not found");
    }

    if (queue.isIdle()) {
      queue.play();
    }
  }

  interaction.replied || interaction.reply({ content: "👌", ephemeral: true });
});

function createEmbed(author: GuildMember, track: Track): MessageEmbed {
  const embed = new MessageEmbed()
    .setColor(0xed9420)
    .setDescription([`${author} added a new track:`, `**${track}**`].join("\n"))
    .setFields([
      {
        name: "Link",
        value: track.url,
      },
      {
        name: "Duration",
        value: track.duration,
      },
    ])
    .setThumbnail(
      track.thumbnail ||
        "https://i.ytimg.com/vi/5yx6BWlEVcY/hq720_live.jpg?sqp=CLTTmIsG-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB_pVK3jR5yufoubu0lTW2C0Gud4Q",
    )
    .setURL(track.url)
    .setFooter("Help me improve: https://github.com/felds/mocoto");

  return embed;
}
