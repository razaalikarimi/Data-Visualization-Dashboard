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

interface GeoChartProps {
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

export default function GeoChart({ filters }: GeoChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('GeoChart: Filters changed, fetching data...', filters);
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
        
        // Country distribution
        const countryData = distributions.countries.slice(0, 15).map((item: any) => ({
          label: item._id || 'Unknown',
          count: item.count || 0,
        }));

        // Region distribution
        const regionData = distributions.regions.map((item: any) => ({
          label: item._id || 'Unknown',
          count: item.count || 0,
        }));

        setChartData({
          countryData,
          regionData,
        });
      }
    } catch (error) {
      console.error('Error fetching geo data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  const countryChartData = {
    labels: chartData.countryData.map((item: any) => item.label),
    datasets: [
      {
        label: 'Records by Country',
        data: chartData.countryData.map((item: any) => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const regionChartData = {
    labels: chartData.regionData.map((item: any) => item.label),
    datasets: [
      {
        label: 'Records by Region',
        data: chartData.regionData.map((item: any) => item.count),
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
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Distribution by Country</h3>
        <div className="h-80">
          <Bar data={countryChartData} options={options} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Distribution by Region</h3>
        <div className="h-80">
          <Bar data={regionChartData} options={options} />
        </div>
      </div>
    </div>
  );
}

