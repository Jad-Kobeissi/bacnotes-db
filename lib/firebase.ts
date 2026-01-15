import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
export const app = initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
});

export const storage = getStorage(app);
