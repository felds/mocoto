import { getVoiceConnection } from "@discordjs/voice";
import { ApplicationCommandData, GuildMember, MessageEmbed } from "discord.js";
import { loadTracks } from "../player/query-loader";
import { getQueue } from "../player/queue";
import { Track } from "../player/track";
import { addCommandHandler, join, registerCommand } from "../util/discord";
import { createBaseEmbed } from "../util/message";
import { msToDuration } from "../util/string";

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

  // interaction.replied || interaction.reply({ content: "👌", ephemeral: true });
});

function createEmbed(author: GuildMember, track: Track): MessageEmbed {
  const embed = createBaseEmbed().setDescription(
    `${author} added a new track:\n**${track}**`,
  );

  if (track.url) {
    embed.addField("Url", track.url);
    embed.setURL(track.url);
  }

  embed.addField("Duration", msToDuration(track.duration));

  if (track.thumbnail) {
    embed.setThumbnail(track.thumbnail);
  }

  return embed;
}
