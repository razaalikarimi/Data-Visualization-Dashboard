import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DataPoint from '@/lib/models/DataPoint';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    
    // Extract filter parameters (same as data endpoint)
    const endYear = searchParams.get('end_year');
    const topic = searchParams.get('topic');
    const sector = searchParams.get('sector');
    const region = searchParams.get('region');
    const pestle = searchParams.get('pestle');
    const source = searchParams.get('source');
    const swot = searchParams.get('swot');
    const country = searchParams.get('country');
    const city = searchParams.get('city');

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

    // Get aggregated statistics
    const stats = await DataPoint.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          avgIntensity: { $avg: '$intensity' },
          avgLikelihood: { $avg: '$likelihood' },
          avgRelevance: { $avg: '$relevance' },
          totalRecords: { $sum: 1 },
          intensityByTopic: {
            $push: {
              topic: '$topic',
              intensity: '$intensity',
            },
          },
          likelihoodByRegion: {
            $push: {
              region: '$region',
              likelihood: '$likelihood',
            },
          },
          relevanceByCountry: {
            $push: {
              country: '$country',
              relevance: '$relevance',
            },
          },
        },
      },
    ]);

    // Get distribution data
    const topicDistribution = await DataPoint.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$topic',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const countryDistribution = await DataPoint.aggregate([
      { $match: filter },
      { $match: { country: { $ne: '' } } },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          avgRelevance: { $avg: '$relevance' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const regionDistribution = await DataPoint.aggregate([
      { $match: filter },
      { $match: { region: { $ne: '' } } },
      {
        $group: {
          _id: '$region',
          count: { $sum: 1 },
          avgLikelihood: { $avg: '$likelihood' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const sectorDistribution = await DataPoint.aggregate([
      { $match: filter },
      { $match: { sector: { $ne: '' } } },
      {
        $group: {
          _id: '$sector',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const yearDistribution = await DataPoint.aggregate([
      { $match: filter },
      { $match: { end_year: { $ne: '' } } },
      {
        $group: {
          _id: '$end_year',
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      success: true,
      stats: stats[0] || {},
      distributions: {
        topics: topicDistribution,
        countries: countryDistribution,
        regions: regionDistribution,
        sectors: sectorDistribution,
        years: yearDistribution,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

