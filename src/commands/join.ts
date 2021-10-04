import {
  ApplicationCommandData,
  BaseGuildVoiceChannel,
  GuildChannel,
  GuildMember,
} from "discord.js";
import { join } from "../discord";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  type: "CHAT_INPUT",
  name: "join",
  description: "Join a voice channel.",
  options: [
    {
      name: "channel",
      type: "CHANNEL",
      description: "The voice channel to join.",
    },
  ],
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  if (!interaction.inGuild()) return;

  const member = interaction.member as GuildMember;
  let channel: BaseGuildVoiceChannel | null = member.voice.channel;

  // override member channel
  const optionChannel = interaction.options.getChannel(
    "channel",
  ) as GuildChannel | null;
  if (optionChannel) {
    if (!optionChannel.isVoice()) {
      return interaction.reply({
        content: `${optionChannel.name} is not a voice channel.`,
        ephemeral: true,
      });
    }
    channel = optionChannel;
  }

  if (!channel) {
    return interaction.reply({
      content: `You must be connected to a voice channel or provide a custom channel.`,
      ephemeral: true,
    });
  }

  if (!channel.joinable) {
    return interaction.reply({
      content: `I can't join channel ${channel.name}.`,
      ephemeral: true,
    });
  }

  join(channel);
  return interaction.reply({ content: `I'm in. 😎`, ephemeral: true });

  // const player = createAudioPlayer();
  // connection.subscribe(player);

  // const stream = ytdl(url, { filter: "audioonly" });
  // const resource = createAudioResource(stream, {
  //   inputType: StreamType.Arbitrary,
  // });

  // player.play(resource);
  // player.on(AudioPlayerStatus.Idle, () => connection.destroy());
  // to(interaction, "ok");
});
