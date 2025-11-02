import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;

    // ✅ Build-safe null check
    if (!db) {
      return NextResponse.json({
        success: false,
        message: "Database is not available at build time — this is normal.",
        hint: "Visit this API after deployment to see DB data."
      });
    }

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    let results: any = {
      connection: 'connected',
      database: db.databaseName,
      collections: collectionNames,
      data: {}
    };

    // Try different possible collection names
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
        // Collection doesn't exist — ignore
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
