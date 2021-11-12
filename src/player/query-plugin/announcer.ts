import { getBot } from "../../bot";
import { createBaseEmbed } from "../../util/message";
import { QueuePlugin } from "../query-plugin";

const onPlay: QueuePlugin["onPlay"] = async (params) => {
  const bot = getBot(params.guildId);
  const channel = bot.textChannel;
  if (!channel) return;

  const embed = createBaseEmbed();
  embed.setDescription("Tá rolando música");

  const message = await channel.send({
    embeds: [embed],
  });
  console.log("Message sent", message.id);
};

const Announcer: QueuePlugin = {
  onPlay,
};
export default Announcer;
