'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface RelevanceChartProps {
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

export default function RelevanceChart({ filters }: RelevanceChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('RelevanceChart: Filters changed, fetching data...', filters);
    fetchData();
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all') {
          params.append(key === 'endYear' ? 'end_year' : key, value);
        }
      });

      const response = await axios.get(`/api/stats?${params.toString()}`);
      
      if (response.data.success) {
        const { distributions } = response.data;
        
        // Country-based relevance distribution
        const countryData = distributions.countries.slice(0, 10).map((item: any) => ({
          label: item._id || 'Unknown',
          relevance: item.avgRelevance || 0,
        }));

        setChartData({
          countryData,
          overallAvg: response.data.stats.avgRelevance || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching relevance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Relevance Analysis</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  const barChartData = {
    labels: chartData.countryData.map((item: any) => item.label),
    datasets: [
      {
        label: 'Average Relevance by Country',
        data: chartData.countryData.map((item: any) => item.relevance),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: chartData.countryData.slice(0, 5).map((item: any) => item.label),
    datasets: [
      {
        label: 'Relevance Distribution',
        data: chartData.countryData.slice(0, 5).map((item: any) => item.relevance),
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Relevance by Country</h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Avg</p>
            <p className="text-xl font-bold text-purple-600">
              {chartData.overallAvg.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-80">
          <Bar data={barChartData} options={options} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Top 5 Countries - Relevance</h3>
        <div className="h-80">
          <Pie data={pieChartData} options={options} />
        </div>
      </div>
    </div>
  );
}

