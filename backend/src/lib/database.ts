import { MongoClient, Db, Collection } from 'mongodb';
import type { Listing, Category, User } from '../../../shared/types';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(uri: string): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db('mobb');
    
    console.log('Connected to MongoDB Atlas');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getDatabase(env: { MONGODB_URI: string }): Promise<Db> {
  return await connectToDatabase(env.MONGODB_URI);
}

export async function getListingsCollection(env: { MONGODB_URI: string }): Promise<Collection<Listing>> {
  const database = await getDatabase(env);
  return database.collection<Listing>('listings');
}

export async function getCategoriesCollection(env: { MONGODB_URI: string }): Promise<Collection<Category>> {
  const database = await getDatabase(env);
  return database.collection<Category>('categories');
}

export async function getUsersCollection(env: { MONGODB_URI: string }): Promise<Collection<User>> {
  const database = await getDatabase(env);
  return database.collection<User>('users');
}

// Database indexes setup
export async function setupIndexes(env: { MONGODB_URI: string }): Promise<void> {
  const database = await getDatabase(env);
  
  // Listings indexes
  const listings = database.collection('listings');
  await listings.createIndex({ name: 1, city: 1 });
  await listings.createIndex({ location: '2dsphere' });
  await listings.createIndex({ categories: 1 });
  await listings.createIndex({ 'coordinates': '2dsphere' });
  await listings.createIndex({ google_id: 1 }, { sparse: true });
  await listings.createIndex({ yelp_id: 1 }, { sparse: true });
  await listings.createIndex({ submitted: -1 });
  
  // Categories indexes
  const categories = database.collection('categories');
  await categories.createIndex({ name: 1 }, { unique: true });
  await categories.createIndex({ count: -1 });
  
  // Users indexes
  const users = database.collection('users');
  await users.createIndex({ username: 1 }, { unique: true, sparse: true });
  await users.createIndex({ 'emails.address': 1 }, { unique: true, sparse: true });
  await users.createIndex({ createdAt: -1 });
  
  console.log('Database indexes created successfully');
}

// Utility function to close database connection
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Database connection closed');
  }
}
