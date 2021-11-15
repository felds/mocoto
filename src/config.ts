import assert from "assert";
import dotenv from "dotenv";
import { existsSync } from "fs";
dotenv.config();

assert(process.env.TOKEN, "Please provide a token for the bot.");
export const TOKEN = process.env.TOKEN;

export const GUILD_ID = process.env.GUILD_ID;

process.env.GOOGLE_APPLICATION_CREDENTIALS;
assert(
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  "Please set the parameter GOOGLE_APPLICATION_CREDENTIALS.",
);
assert(
  existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  "GOOGLE_APPLICATION_CREDENTIALS is not a file.",
);
export const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS;

export const Styles = {
  accentColor: 0x1fdbcc,
};
