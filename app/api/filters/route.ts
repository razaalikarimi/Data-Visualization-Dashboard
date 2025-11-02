import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DataPoint from '@/lib/models/DataPoint';

export async function GET() {
  try {
    await connectDB();

    // Get all unique filter values
    const [topics, sectors, regions, pestles, sources, countries, cities, swots, endYears] = await Promise.all([
      DataPoint.distinct('topic').then(arr => arr.filter(Boolean).sort()),
      DataPoint.distinct('sector').then(arr => arr.filter(Boolean).sort()),
      DataPoint.distinct('region').then(arr => arr.filter(Boolean).sort()),
      DataPoint.distinct('pestle').then(arr => arr.filter(Boolean).sort()),
      DataPoint.distinct('source').then(arr => arr.filter(Boolean).sort()),
      DataPoint.distinct('country').then(arr => arr.filter(Boolean).sort()),
      DataPoint.distinct('city').then(arr => arr.filter(Boolean).sort()),
      DataPoint.distinct('swot').then(arr => arr.filter(Boolean).sort()),
      DataPoint.distinct('end_year').then(arr => arr.filter(Boolean).sort()),
    ]);

    return NextResponse.json({
      success: true,
      filters: {
        topics,
        sectors,
        regions,
        pestles,
        sources,
        countries,
        cities,
        swots,
        endYears,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

