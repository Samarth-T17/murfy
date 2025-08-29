// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { collection, addDoc, getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export default app;

export async function addPodcast(description: string, idea: string, podcastId: string, podcastTextContent: string, userId: string, urls: Record<string, string>) {
  try {
    const docRef = await addDoc(collection(db, "podcasts/podcasts"), {
      "description": description,
      "idea": idea,
      "podcastId": podcastId,
      "podcastTextContent": podcastTextContent,
      "urls": {
        "bengali": urls.bengali || "",
        "english": urls.english || "",
        "french": urls.french || "",
        "german": urls.german || "",
        "hindhi": urls.hindhi || "",
        "italy": urls.italy || "",
        "tamil": urls.tamil || "",
      },
      "user-id": userId
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
