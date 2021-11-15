import assert from "assert";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export const TOKEN = process.env.TOKEN!;
export const GUILD_ID = process.env.GUILD_ID!;

process.env.FIREBASE_CREDENTIALS_PATH;
assert(
  process.env.FIREBASE_CREDENTIALS_PATH,
  "Please set the parameter FIREBASE_CREDENTIALS_PATH.",
);
assert(
  fs.existsSync(process.env.FIREBASE_CREDENTIALS_PATH),
  "FIREBASE_CREDENTIALS_PATH is not a file.",
);
export const FIREBASE_CREDENTIALS_PATH = process.env.FIREBASE_CREDENTIALS_PATH;

export const Styles = {
  accentColor: 0x1fdbcc,
};
