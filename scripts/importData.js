const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackcoffer';

const DataPointSchema = new mongoose.Schema({
  end_year: { type: String, default: '' },
  intensity: { type: Number, default: 0 },
  sector: { type: String, default: '' },
  topic: { type: String, default: '' },
  insight: { type: String, default: '' },
  url: { type: String, default: '' },
  region: { type: String, default: '' },
  start_year: { type: String, default: '' },
  impact: { type: String, default: '' },
  added: { type: String, default: '' },
  published: { type: String, default: '' },
  country: { type: String, default: '' },
  relevance: { type: Number, default: 0 },
  pestle: { type: String, default: '' },
  source: { type: String, default: '' },
  title: { type: String, default: '' },
  likelihood: { type: Number, default: 0 },
  city: { type: String, default: '' },
  swot: { type: String, default: '' },
}, {
  timestamps: false,
});

const DataPoint = mongoose.models.DataPoint || mongoose.model('DataPoint', DataPointSchema);

async function importData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read JSON file
    const jsonPath = path.join(__dirname, '../jsondata.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log(`Found ${jsonData.length} records in JSON file`);

    // Clear existing data
    await DataPoint.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    const result = await DataPoint.insertMany(jsonData);
    console.log(`Successfully imported ${result.length} records`);

    await mongoose.connection.close();
    console.log('Import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();

