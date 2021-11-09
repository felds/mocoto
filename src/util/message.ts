import { MessageEmbed } from "discord.js";
import { Styles } from "../config";

export function createBaseEmbed() {
  return new MessageEmbed()
    .setColor(Styles.accentColor)
    .setFooter("Help me improve: https://github.com/felds/mocoto");
}
