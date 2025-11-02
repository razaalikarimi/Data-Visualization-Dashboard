import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    // Try different collection names
    const collectionNames = collections.map(c => c.name);
    
    let results: any = {
      connection: 'connected',
      database: db.databaseName,
      collections: collectionNames,
      data: {}
    };

    // Try to find data in common collection names
    const possibleNames = ['datapoints', 'DataPoint', 'data', 'dataPoints'];
    
    for (const name of possibleNames) {
      try {
        const collection = db.collection(name);
        const count = await collection.countDocuments();
        if (count > 0) {
          const sample = await collection.findOne({});
          results.data[name] = {
            count,
            sample: sample ? Object.keys(sample) : null
          };
        }
      } catch (e) {
        // Collection doesn't exist
      }
    }

    return NextResponse.json({
      success: true,
      ...results
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

