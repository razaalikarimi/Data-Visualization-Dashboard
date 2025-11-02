import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DataPoint from '@/lib/models/DataPoint';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    
    // Extract filter parameters
    const endYear = searchParams.get('end_year');
    const topic = searchParams.get('topic');
    const sector = searchParams.get('sector');
    const region = searchParams.get('region');
    const pestle = searchParams.get('pestle');
    const source = searchParams.get('source');
    const swot = searchParams.get('swot');
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build filter object
    const filter: any = {};
    
    if (endYear && endYear !== 'all' && endYear !== '') {
      filter.end_year = endYear;
    }
    
    if (topic && topic !== 'all') {
      filter.topic = { $regex: topic, $options: 'i' };
    }
    
    if (sector && sector !== 'all') {
      filter.sector = { $regex: sector, $options: 'i' };
    }
    
    if (region && region !== 'all') {
      filter.region = { $regex: region, $options: 'i' };
    }
    
    if (pestle && pestle !== 'all') {
      filter.pestle = { $regex: pestle, $options: 'i' };
    }
    
    if (source && source !== 'all') {
      filter.source = { $regex: source, $options: 'i' };
    }
    
    if (swot && swot !== 'all') {
      filter.swot = { $regex: swot, $options: 'i' };
    }
    
    if (country && country !== 'all') {
      filter.country = { $regex: country, $options: 'i' };
    }
    
    if (city && city !== 'all') {
      filter.city = { $regex: city, $options: 'i' };
    }

    // Get filtered data
    const data = await DataPoint.find(filter).limit(limit).skip(skip);
    const total = await DataPoint.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data,
      total,
      limit,
      skip,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

