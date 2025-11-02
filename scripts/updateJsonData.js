const fs = require('fs');
const path = require('path');

// Helper script to update jsondata.json
// Usage: node scripts/updateJsonData.js path/to/your/data.json

const targetFile = path.join(__dirname, '../jsondata.json');

if (process.argv.length < 3) {
  console.log('Usage: node scripts/updateJsonData.js <path-to-json-file>');
  console.log('Or place your complete JSON data in jsondata.json directly');
  process.exit(1);
}

const sourceFile = process.argv[2];

try {
  console.log(`Reading data from: ${sourceFile}`);
  const data = fs.readFileSync(sourceFile, 'utf8');
  const json = JSON.parse(data);
  
  if (!Array.isArray(json)) {
    throw new Error('JSON must be an array of objects');
  }
  
  console.log(`Found ${json.length} entries`);
  
  // Write to jsondata.json
  fs.writeFileSync(targetFile, JSON.stringify(json, null, 2), 'utf8');
  console.log(`✅ Successfully updated jsondata.json with ${json.length} entries`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

