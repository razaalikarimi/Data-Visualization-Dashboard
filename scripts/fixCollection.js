const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackcoffer';

async function fixCollection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`📊 Database: ${dbName}`);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Available collections:');
    collections.forEach(c => {
      console.log(`   - ${c.name} (${c.type})`);
    });

    // Find the collection with data
    let dataCollection = null;
    let maxCount = 0;

    for (const col of collections) {
      const collection = db.collection(col.name);
      const count = await collection.countDocuments();
      console.log(`\n   ${col.name}: ${count} documents`);
      
      if (count > maxCount) {
        maxCount = count;
        dataCollection = col.name;
      }
    }

    if (!dataCollection || maxCount === 0) {
      console.log('\n❌ No collections with data found!');
      console.log('   Please import your data first.');
      process.exit(1);
    }

    console.log(`\n✅ Found data in collection: "${dataCollection}" (${maxCount} documents)`);

    // Check if it's already named "datapoints"
    if (dataCollection.toLowerCase() === 'datapoints') {
      console.log('\n✅ Collection name is correct! No changes needed.');
      process.exit(0);
    }

    // Check if "datapoints" collection exists
    const datapointsExists = collections.some(c => c.name.toLowerCase() === 'datapoints');
    
    if (datapointsExists) {
      const datapointsCollection = db.collection('datapoints');
      const datapointsCount = await datapointsCollection.countDocuments();
      console.log(`\n⚠️  Collection "datapoints" already exists with ${datapointsCount} documents`);
      
      if (datapointsCount === 0) {
        console.log('\n📋 Copying data from "' + dataCollection + '" to "datapoints"...');
        const sourceCollection = db.collection(dataCollection);
        const data = await sourceCollection.find({}).toArray();
        
        if (data.length > 0) {
          await datapointsCollection.insertMany(data);
          console.log(`✅ Copied ${data.length} documents to "datapoints"`);
        }
      } else {
        console.log('\n⚠️  "datapoints" already has data. Skipping copy.');
      }
    } else {
      // Rename the collection
      console.log(`\n📋 Renaming "${dataCollection}" to "datapoints"...`);
      await db.collection(dataCollection).rename('datapoints');
      console.log(`✅ Renamed "${dataCollection}" to "datapoints"`);
    }

    // Verify
    const finalCollection = db.collection('datapoints');
    const finalCount = await finalCollection.countDocuments();
    console.log(`\n✅ Final count: ${finalCount} documents in "datapoints"`);

    await mongoose.connection.close();
    console.log('\n✅ Done! Refresh your dashboard at http://localhost:3000');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixCollection();

