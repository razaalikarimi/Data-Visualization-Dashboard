'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface IntensityChartProps {
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

export default function IntensityChart({ filters }: IntensityChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('IntensityChart: Filters changed, fetching data...', filters);
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
        
        // Topic-based intensity distribution
        const topicData = distributions.topics.slice(0, 10).map((item: any) => ({
          label: item._id || 'Unknown',
          intensity: item.avgIntensity || 0,
        }));

        // Sector-based intensity distribution
        const sectorData = distributions.sectors.slice(0, 8).map((item: any) => ({
          label: item._id || 'Unknown',
          intensity: item.avgIntensity || 0,
        }));

        setChartData({
          topicData,
          sectorData,
          overallAvg: response.data.stats.avgIntensity || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching intensity data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Intensity Analysis</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  const lineChartData = {
    labels: chartData.topicData.map((item: any) => item.label),
    datasets: [
      {
        label: 'Average Intensity by Topic',
        data: chartData.topicData.map((item: any) => item.intensity),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: chartData.sectorData.map((item: any) => item.label),
    datasets: [
      {
        label: 'Average Intensity by Sector',
        data: chartData.sectorData.map((item: any) => item.intensity),
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
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Intensity by Topic</h3>
        <div className="h-64">
          <Line data={lineChartData} options={options} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Intensity by Sector</h3>
        <div className="h-64">
          <Bar data={barChartData} options={options} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Overall Average Intensity</p>
            <p className="text-4xl font-bold text-blue-600">
              {chartData.overallAvg.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

