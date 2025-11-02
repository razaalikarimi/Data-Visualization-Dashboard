'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LikelihoodChartProps {
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

export default function LikelihoodChart({ filters }: LikelihoodChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('LikelihoodChart: Filters changed, fetching data...', filters);
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
        
        // Region-based likelihood distribution
        const regionData = distributions.regions.map((item: any) => ({
          label: item._id || 'Unknown',
          likelihood: item.avgLikelihood || 0,
        }));

        setChartData({
          regionData,
          overallAvg: response.data.stats.avgLikelihood || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching likelihood data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Likelihood Analysis</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  const barChartData = {
    labels: chartData.regionData.map((item: any) => item.label),
    datasets: [
      {
        label: 'Average Likelihood by Region',
        data: chartData.regionData.map((item: any) => item.likelihood),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Likelihood Analysis</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Overall Average</p>
          <p className="text-2xl font-bold text-green-600">
            {chartData.overallAvg.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="h-80">
        <Bar data={barChartData} options={options} />
      </div>
    </div>
  );
}

