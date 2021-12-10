import {
  buttonComponent,
  embedComponent,
  Gatekeeper,
} from "@itsmapleleaf/gatekeeper";
import { TOKEN } from "./src/config";
import { client } from "./src/discord";

console.clear();

async function main() {
  const gatekeeper = await Gatekeeper.create({ client });

  gatekeeper.addSlashCommand({
    name: "counter",
    description: "Make a counter",
    run(context) {
      let count = 0;
      context.reply(() => [
        embedComponent({ description: `button pressed ${count} times` }),
        buttonComponent({
          style: "PRIMARY",
          label: "Press me",
          onClick: () => {
            count += 1;
          },
        }),
      ]);
    },
  });

  client.login(TOKEN);
}
main().catch((err) => console.error("Panic while setting up.", err));
