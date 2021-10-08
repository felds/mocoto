import { getVoiceConnection } from "@discordjs/voice";
import { ApplicationCommandData, GuildMember } from "discord.js";
import { getQueue } from "../player/queue";
import { addCommandHandler, join, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  name: "pause",
  description: "Pause a track if is playing.",
  type: "CHAT_INPUT",
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const member = interaction.member as GuildMember;
  const guild = interaction.guild!;
  const queue = getQueue(guild.id);

  const connection = getVoiceConnection(guild.id);
  if (!connection) {
    join(member);
  }

  if(queue.isPlayng()){
      queue.pause()
  }
  interaction.replied || interaction.reply({ content: "👌", ephemeral: true });
});
