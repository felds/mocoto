import { generateDependencyReport } from "@discordjs/voice";
import { join } from "path";
import { homeAlone } from "./src/client-events/home-alone";
import { TOKEN } from "./src/config";
import { client } from "./src/discord";
import { importDir } from "./src/util/fs";

// make nodemon more usable
console.clear();

// make sure voice has everything needed to work properly
console.log(generateDependencyReport());

async function main() {
  // import all commands from the commands folder
  await importDir(join(__dirname, "src/commands"));

  // once everything is loaded, log in
  client.login(TOKEN);

  client.on("ready", () => console.log("Ready!!"));
  client.on("voiceStateUpdate", homeAlone);
}
main().catch((err) => console.error("Panic while setting up.", err));

process.on("unhandledRejection", (reason, promise) => {
  console.log("?".repeat(120));
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on(
  "uncaughtException",
  (error: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
    console.log("!".repeat(120));
    console.log("Uncaught Exception: ", error, origin);
  },
);
