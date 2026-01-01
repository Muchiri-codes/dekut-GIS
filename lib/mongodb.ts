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

    globalWithMongo._mongoClientPromise = client.connect().then(async (client) => {
  const dbName = "dekut_landmarks"; 
  const db = client.db(dbName);
  const collections = await db.listCollections().toArray();
  
  console.log('🏠 LOCAL MONGODB CONNECTED');
  console.log(`Database: ${dbName}`);
  console.log('Collections:', collections.map(c => c.name));
  
  return client;
});
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then((client) => {
    console.log('--- ✅ MongoDB Connected Successfully (Production) ---');
    return client;
  });
}

export default clientPromise;