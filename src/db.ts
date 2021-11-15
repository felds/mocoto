import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { FIREBASE_CREDENTIALS_PATH } from "./config";

const serviceAccount = require(FIREBASE_CREDENTIALS_PATH);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export default db;
