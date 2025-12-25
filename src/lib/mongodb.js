import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  console.warn('MongoDB URI not found. Please add MONGODB_URI to your .env.local file');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri || 'mongodb://localhost:27017/care-xyz', options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri || 'mongodb://localhost:27017/care-xyz', options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper function to get database
export async function getDatabase() {
  const client = await clientPromise;
  return client.db('care-xyz');
}

// Helper function to get collection
export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}
