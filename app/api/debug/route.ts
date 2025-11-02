import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import DataPoint from '@/lib/models/DataPoint';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    connection: {},
    database: {},
    collection: {},
    sampleData: null,
    error: null
  };

  try {
    // Test connection
    await connectDB();
    diagnostics.connection.status = 'Connected';
    diagnostics.connection.uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blackcoffer';
    
    const db = mongoose.connection.db;
    diagnostics.database.name = db.databaseName;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    diagnostics.database.collections = collections.map(c => ({
      name: c.name,
      type: c.type
    }));
    
    // Check datapoints collection
    const collection = db.collection('datapoints');
    const count = await collection.countDocuments();
    diagnostics.collection.name = 'datapoints';
    diagnostics.collection.count = count;
    
    if (count > 0) {
      // Get sample document
      const sample = await collection.findOne({});
      diagnostics.sampleData = {
        keys: Object.keys(sample || {}),
        hasIntensity: 'intensity' in (sample || {}),
        hasLikelihood: 'likelihood' in (sample || {}),
        hasRelevance: 'relevance' in (sample || {}),
      };
      
      // Test Mongoose model
      const mongooseCount = await DataPoint.countDocuments();
      diagnostics.collection.mongooseCount = mongooseCount;
      
      if (mongooseCount > 0) {
        const mongooseSample = await DataPoint.findOne({});
        diagnostics.sampleData.mongooseSample = mongooseSample ? {
          intensity: mongooseSample.intensity,
          likelihood: mongooseSample.likelihood,
          relevance: mongooseSample.relevance,
          topic: mongooseSample.topic,
          country: mongooseSample.country,
        } : null;
      }
    } else {
      diagnostics.error = 'Collection "datapoints" exists but is empty. Please check: 1) Database name matches, 2) Collection name is "datapoints" (lowercase, plural), 3) Data was imported correctly.';
    }
    
  } catch (error: any) {
    diagnostics.error = error.message;
    diagnostics.stack = error.stack;
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.error ? 500 : 200
  });
}

