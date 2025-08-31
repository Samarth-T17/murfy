import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGODB_URI as string; 
if (!uri) throw new Error("Missing MONGODB_URI env var");

export interface Podcast {
  _id: string;                  
  description: string;
  idea: string;
  podcastTextContent: string;
  urls: {
    bengali: string;
    english: string;
    french: string;
    german: string;
    hindi: string;
    italy: string;
    tamil: string;
  };
  userId: string;
  createdAt: Date;
}

let client: MongoClient | null = null;
let db: Db;
let podcasts: Collection<Podcast>;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("murf");
    podcasts = db.collection<Podcast>("podcasts");
  }
  return { db, podcasts };
}

export async function addPodcast(
  description: string,
  idea: string,
  podcastId: string,
  podcastTextContent: string,
  userId: string,
  urls: Record<string, string> = {}
) {
  try {
    const { podcasts } = await connectDB();

    const doc: Podcast = {
      _id: podcastId, 
      description: description || "",
      idea: idea || "",
      podcastTextContent: podcastTextContent || "",
      urls: {
        bengali: urls.bengali || "",
        english: urls.english || "",
        french: urls.french || "",
        german: urls.german || "",
        hindi: urls.hindi || "",
        italy: urls.italy || "",
        tamil: urls.tamil || "",
      },
      userId: userId || "",
      createdAt: new Date(),
    };

    await podcasts.updateOne(
      { _id: podcastId },
      { $set: doc },
      { upsert: true }
    );

    console.log("Podcast written with ID:", podcastId);
  } catch (e) {
    console.error("Error adding podcast:", e);
  }
}