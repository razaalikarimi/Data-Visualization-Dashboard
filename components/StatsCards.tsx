'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface StatsCardsProps {
  filters: {
    endYear: string;
    topic: string;
    sector: string;
    region: string;
    pestle: string;
    source: string;
    swot: string;
    country: string;
    city: string;
  };
}

export default function StatsCards({ filters }: StatsCardsProps) {
  const [stats, setStats] = useState<any>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('StatsCards: Filters changed, fetching stats...', filters);
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.endYear,
    filters.topic,
    filters.sector,
    filters.region,
    filters.pestle,
    filters.source,
    filters.swot,
    filters.country,
    filters.city,
  ]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all') {
          params.append(key === 'endYear' ? 'end_year' : key, value);
        }
      });

      const [statsResponse, dataResponse] = await Promise.all([
        axios.get(`/api/stats?${params.toString()}`),
        axios.get(`/api/data?${params.toString()}&limit=1`),
      ]);

      if (statsResponse.data.success && dataResponse.data.success) {
        setStats(statsResponse.data.stats);
        setTotalRecords(dataResponse.data.total);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Records',
      value: totalRecords.toLocaleString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '📊',
    },
    {
      title: 'Avg Intensity',
      value: stats?.avgIntensity?.toFixed(2) || '0.00',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '⚡',
    },
    {
      title: 'Avg Likelihood',
      value: stats?.avgLikelihood?.toFixed(2) || '0.00',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: '🎯',
    },
    {
      title: 'Avg Relevance',
      value: stats?.avgRelevance?.toFixed(2) || '0.00',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: '⭐',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

