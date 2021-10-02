import { TOKEN } from "./config";
import { client } from "./discord";
import fs from "fs";
import path from "path";

console.clear();

// import all commands from the commands folder
const commandsDir = path.join(__dirname, "commands");
Promise.all(
  fs
    .readdirSync(commandsDir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => import(path.join(commandsDir, f))),
).then(() => {
  client.login(TOKEN);
});
