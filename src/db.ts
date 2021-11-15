import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { FIREBASE_CREDENTIALS_PATH } from "./config";

const serviceAccount = require(FIREBASE_CREDENTIALS_PATH);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

export type BotConfig = {
  textChannelId?: string;
};

export async function getConfig<T extends keyof BotConfig>(
  guildId: string,
  key: T,
  fallback?: BotConfig[T],
): Promise<BotConfig[T]> {
  const doc = db.collection("guilds").doc(guildId);
  const data = (await doc.get()).data();
  const value = data?.[key];
  return value ?? fallback;
}

export async function setConfig<T extends keyof BotConfig>(
  guildId: string,
  key: T,
  value: BotConfig[T],
): Promise<void> {
  const doc = db.collection("guilds").doc(guildId);
  await doc.set({ [key]: value }, { merge: true });
}

export async function unsetConfig<T extends keyof BotConfig>(
  guildId: string,
  key: T,
): Promise<void> {
  const doc = db.collection("guilds").doc(guildId);
  await doc.set({ [key]: FieldValue.delete() }, { merge: true });
}
