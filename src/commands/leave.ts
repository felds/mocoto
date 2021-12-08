import { getVoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { ApplicationCommandData } from "discord.js";
import { getQueue } from "../player/queue";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  name: "leave",
  description: "Leaves the voice channel.",
  type: "CHAT_INPUT",
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  if (!interaction.inGuild()) return;

  const { guildId } = interaction;
  const connection = getVoiceConnection(guildId);

  const isConnected =
    connection &&
    connection.state.status !== VoiceConnectionStatus.Disconnected;

  if (!isConnected) {
    interaction.reply({ content: "I'm not even connected…" });
    return;
  }

  const queue = getQueue(guildId);
  queue.destroy();

  interaction.reply({ content: "See you later, crocodile! 👋" });
});
