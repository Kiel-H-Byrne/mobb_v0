#!/usr/bin/env node

/**
 * Data Migration Script for MOBB v3
 * 
 * This script helps migrate data from the legacy Meteor application
 * to the new MongoDB Atlas database with the updated schema.
 * 
 * Usage:
 *   node scripts/migrate-data.js --source <meteor-db-url> --target <atlas-db-url>
 */

import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  sourceDb: process.env.SOURCE_MONGODB_URI || 'mongodb://localhost:3001/meteor',
  targetDb: process.env.TARGET_MONGODB_URI || process.env.MONGODB_URI,
  batchSize: 100,
  dryRun: process.argv.includes('--dry-run'),
};

// Schema transformation functions
function transformListing(meteorListing) {
  const transformed = {
    name: meteorListing.name,
    description: meteorListing.description,
    street: meteorListing.street,
    city: meteorListing.city,
    state: meteorListing.state,
    zip: meteorListing.zip,
    country: meteorListing.country || 'US',
    address: meteorListing.address,
    location: meteorListing.location, // Keep original lat,lng string
    phone: meteorListing.phone,
    url: meteorListing.url,
    email: meteorListing.email,
    categories: meteorListing.categories || [],
    social: meteorListing.social || {},
    image: meteorListing.image,
    owner: meteorListing.owner || {},
    claims: meteorListing.claims || [],
    claimsCount: meteorListing.claimsCount || 0,
    verifiers: meteorListing.verifiers || [],
    verifierCount: meteorListing.verifierCount || 0,
    deverifiers: meteorListing.deverifiers || [],
    deverifierCount: meteorListing.deverifierCount || 0,
    google_id: meteorListing.google_id,
    yelp_id: meteorListing.yelp_id,
    creator: meteorListing.creator,
    submitted: meteorListing.submitted || new Date(),
    updatedAt: new Date(),
  };

  // Convert location string to coordinates object
  if (transformed.location && typeof transformed.location === 'string') {
    const [lat, lng] = transformed.location.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      transformed.coordinates = { lat, lng };
    }
  }

  return transformed;
}

function transformCategory(meteorCategory) {
  return {
    name: meteorCategory.name,
    count: meteorCategory.count || 0,
  };
}

function transformUser(meteorUser) {
  return {
    username: meteorUser.username,
    emails: meteorUser.emails || [],
    createdAt: meteorUser.createdAt || new Date(),
    profile: {
      firstName: meteorUser.profile?.firstName,
      lastName: meteorUser.profile?.lastName,
      email: meteorUser.profile?.email || meteorUser.emails?.[0]?.address,
      social: meteorUser.profile?.social || {},
      ownedListings: meteorUser.profile?.ownedListings || [],
      verifiedListings: meteorUser.profile?.verifiedListings || [],
      deverifiedListings: meteorUser.profile?.deverifiedListings || [],
      favorites: meteorUser.profile?.favorites || [],
    },
    services: meteorUser.services, // Keep authentication data
  };
}

// Migration functions
async function migrateCollection(sourceDb, targetDb, collectionName, transformFn) {
  console.log(`\n📦 Migrating ${collectionName}...`);
  
  const sourceCollection = sourceDb.collection(collectionName);
  const targetCollection = targetDb.collection(collectionName);
  
  // Get total count
  const totalCount = await sourceCollection.countDocuments();
  console.log(`   Found ${totalCount} documents`);
  
  if (totalCount === 0) {
    console.log(`   ⚠️  No documents found in ${collectionName}`);
    return;
  }
  
  // Clear target collection if not dry run
  if (!config.dryRun) {
    await targetCollection.deleteMany({});
    console.log(`   🗑️  Cleared target collection`);
  }
  
  let processed = 0;
  const cursor = sourceCollection.find({});
  
  while (await cursor.hasNext()) {
    const batch = [];
    
    // Process in batches
    for (let i = 0; i < config.batchSize && await cursor.hasNext(); i++) {
      const doc = await cursor.next();
      try {
        const transformed = transformFn(doc);
        batch.push(transformed);
      } catch (error) {
        console.error(`   ❌ Error transforming document ${doc._id}:`, error.message);
      }
    }
    
    if (batch.length > 0 && !config.dryRun) {
      try {
        await targetCollection.insertMany(batch, { ordered: false });
        processed += batch.length;
        console.log(`   ✅ Processed ${processed}/${totalCount} documents`);
      } catch (error) {
        console.error(`   ❌ Error inserting batch:`, error.message);
      }
    } else if (config.dryRun) {
      processed += batch.length;
      console.log(`   🔍 [DRY RUN] Would process ${processed}/${totalCount} documents`);
    }
  }
  
  console.log(`   ✨ Migration of ${collectionName} completed: ${processed}/${totalCount} documents`);
}

async function createIndexes(db) {
  console.log('\n🔧 Creating database indexes...');
  
  // Listings indexes
  const listings = db.collection('listings');
  await listings.createIndex({ name: 1, city: 1 });
  await listings.createIndex({ coordinates: '2dsphere' });
  await listings.createIndex({ categories: 1 });
  await listings.createIndex({ google_id: 1 }, { sparse: true });
  await listings.createIndex({ yelp_id: 1 }, { sparse: true });
  await listings.createIndex({ submitted: -1 });
  console.log('   ✅ Listings indexes created');
  
  // Categories indexes
  const categories = db.collection('categories');
  await categories.createIndex({ name: 1 }, { unique: true });
  await categories.createIndex({ count: -1 });
  console.log('   ✅ Categories indexes created');
  
  // Users indexes
  const users = db.collection('users');
  await users.createIndex({ username: 1 }, { unique: true, sparse: true });
  await users.createIndex({ 'emails.address': 1 }, { unique: true, sparse: true });
  await users.createIndex({ createdAt: -1 });
  console.log('   ✅ Users indexes created');
}

async function loadInitialData(db) {
  console.log('\n📥 Loading initial data...');
  
  try {
    // Load categories from JSON file
    const categoriesPath = path.join(__dirname, '../lib/config/categories.json');
    const categoriesData = JSON.parse(await fs.readFile(categoriesPath, 'utf8'));
    
    if (categoriesData.Categories && categoriesData.Categories.length > 0) {
      const categoriesCollection = db.collection('categories');
      await categoriesCollection.insertMany(categoriesData.Categories, { ordered: false });
      console.log(`   ✅ Loaded ${categoriesData.Categories.length} categories`);
    }
  } catch (error) {
    console.log(`   ⚠️  Could not load categories: ${error.message}`);
  }
  
  try {
    // Load sample listings if available
    const listingsPath = path.join(__dirname, '../lib/config/listings.json');
    const listingsData = JSON.parse(await fs.readFile(listingsPath, 'utf8'));
    
    if (listingsData && Array.isArray(listingsData) && listingsData.length > 0) {
      const listingsCollection = db.collection('listings');
      const transformedListings = listingsData.map(transformListing);
      await listingsCollection.insertMany(transformedListings, { ordered: false });
      console.log(`   ✅ Loaded ${transformedListings.length} sample listings`);
    }
  } catch (error) {
    console.log(`   ⚠️  Could not load sample listings: ${error.message}`);
  }
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting MOBB v3 Data Migration');
  console.log(`   Source: ${config.sourceDb}`);
  console.log(`   Target: ${config.targetDb}`);
  console.log(`   Dry Run: ${config.dryRun}`);
  
  if (!config.targetDb) {
    console.error('❌ TARGET_MONGODB_URI or MONGODB_URI environment variable is required');
    process.exit(1);
  }
  
  let sourceClient, targetClient;
  
  try {
    // Connect to databases
    console.log('\n🔌 Connecting to databases...');
    
    sourceClient = new MongoClient(config.sourceDb);
    await sourceClient.connect();
    const sourceDb = sourceClient.db();
    console.log('   ✅ Connected to source database');
    
    targetClient = new MongoClient(config.targetDb);
    await targetClient.connect();
    const targetDb = targetClient.db();
    console.log('   ✅ Connected to target database');
    
    // Migrate collections
    await migrateCollection(sourceDb, targetDb, 'listings', transformListing);
    await migrateCollection(sourceDb, targetDb, 'categories', transformCategory);
    await migrateCollection(sourceDb, targetDb, 'users', transformUser);
    
    // Create indexes
    if (!config.dryRun) {
      await createIndexes(targetDb);
    }
    
    // Load initial data if no source data exists
    const listingsCount = await targetDb.collection('listings').countDocuments();
    if (listingsCount === 0 && !config.dryRun) {
      await loadInitialData(targetDb);
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connections
    if (sourceClient) await sourceClient.close();
    if (targetClient) await targetClient.close();
  }
}

// Run migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().catch(console.error);
}
