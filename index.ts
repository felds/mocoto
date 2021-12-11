import { generateDependencyReport } from "@discordjs/voice";
import { Gatekeeper } from "@itsmapleleaf/gatekeeper";
import { join } from "path";
import { TOKEN } from "./src/config";
import { client } from "./src/discord";

// make nodemon more usable
console.clear();

// make sure voice has everything needed to work properly
console.log(generateDependencyReport());

async function main() {
  const gatekeeper = await Gatekeeper.create({
    client,
    commandFolder: join(__dirname, "src/commands"),
  });

  // once everything is loaded, log in
  client.login(TOKEN);
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
