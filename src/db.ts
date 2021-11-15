import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
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
  const doc = await db.collection("guilds").doc(guildId).get();
  const data = doc.data();
  const value = data?.[key];
  return value ?? fallback;
}
