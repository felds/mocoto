import path from "path";
import { TOKEN } from "./config";
import { client } from "./discord";
import { importDir } from "./util/fs";

console.clear();

async function main() {
  // import all commands from the commands folder
  await importDir(path.join(__dirname, "commands"));

  // once everything is loaded, log in
  client.login(TOKEN);
}
main().catch((err) => console.error("Panic while setting up.", err));
