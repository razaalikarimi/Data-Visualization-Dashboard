'use client';

import { useState, useCallback } from 'react';
import Filters, { FilterState } from '@/components/Filters';
import StatsCards from '@/components/StatsCards';
import IntensityChart from '@/components/charts/IntensityChart';
import LikelihoodChart from '@/components/charts/LikelihoodChart';
import RelevanceChart from '@/components/charts/RelevanceChart';
import GeoChart from '@/components/charts/GeoChart';
import TopicDistributionChart from '@/components/charts/TopicDistributionChart';

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    endYear: 'all',
    topic: 'all',
    sector: 'all',
    region: 'all',
    pestle: 'all',
    source: 'all',
    swot: 'all',
    country: 'all',
    city: 'all',
  });

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Blackcoffer Data Visualization Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Interactive analytics and insights from your data
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-600">Last Updated</p>
                <p className="text-sm font-semibold text-blue-600">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards filters={filters} />

        {/* Filters */}
        <Filters onFilterChange={handleFilterChange} />

        {/* Charts Grid */}
        <div className="space-y-6">
          {/* Intensity Charts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Intensity Analysis</h2>
            <IntensityChart filters={filters} />
          </div>

          {/* Likelihood Chart */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Likelihood Analysis</h2>
            <LikelihoodChart filters={filters} />
          </div>

          {/* Relevance Charts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Relevance Analysis</h2>
            <RelevanceChart filters={filters} />
          </div>

          {/* Geographic Distribution */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Geographic Distribution</h2>
            <GeoChart filters={filters} />
          </div>

          {/* Topic Distribution */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Topic Distribution</h2>
            <TopicDistributionChart filters={filters} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Blackcoffer Consulting. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

