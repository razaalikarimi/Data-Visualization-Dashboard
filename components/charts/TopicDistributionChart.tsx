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
import { Doughnut, Bar } from 'react-chartjs-2';
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

interface TopicDistributionChartProps {
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

export default function TopicDistributionChart({ filters }: TopicDistributionChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('TopicDistributionChart: Filters changed, fetching data...', filters);
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
        
        const topicData = distributions.topics.slice(0, 10).map((item: any) => ({
          label: item._id || 'Unknown',
          count: item.count || 0,
        }));

        setChartData({ topicData });
      }
    } catch (error) {
      console.error('Error fetching topic data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Topic Distribution</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  const doughnutData = {
    labels: chartData.topicData.slice(0, 6).map((item: any) => item.label),
    datasets: [
      {
        label: 'Topics',
        data: chartData.topicData.slice(0, 6).map((item: any) => item.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: chartData.topicData.map((item: any) => item.label),
    datasets: [
      {
        label: 'Topic Count',
        data: chartData.topicData.map((item: any) => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
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
        <h3 className="text-lg font-semibold mb-4">Top Topics (Doughnut)</h3>
        <div className="h-80">
          <Doughnut data={doughnutData} options={options} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">All Topics Distribution</h3>
        <div className="h-80">
          <Bar data={barData} options={options} />
        </div>
      </div>
    </div>
  );
}

