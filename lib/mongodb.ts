import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
  
    globalWithMongo._mongoClientPromise = client.connect().then((client) => {
      console.log('✅ MongoDB Connected Successfully (Development)');
      return client;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  // Add .then() to log success
  clientPromise = client.connect().then((client) => {
    console.log('--- ✅ MongoDB Connected Successfully (Production) ---');
    return client;
  });
}

export default clientPromise;