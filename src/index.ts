import path from "path";
import { TOKEN } from "./config";
import { client } from "./discord";
import { importDir } from "./util/fs";
import { generateDependencyReport } from "@discordjs/voice";

// make nodemon more usable
console.clear();

// make sure voice has everything needed to work properly
console.log(generateDependencyReport());

async function main() {
  // import all commands from the commands folder
  await importDir(path.join(__dirname, "commands"));

  // once everything is loaded, log in
  client.login(TOKEN);
}
main().catch((err) => console.error("Panic while setting up.", err));
