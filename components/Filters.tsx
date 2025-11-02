'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface FilterOptions {
  topics: string[];
  sectors: string[];
  regions: string[];
  pestles: string[];
  sources: string[];
  countries: string[];
  cities: string[];
  swots: string[];
  endYears: string[];
}

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  endYear: string;
  topic: string;
  sector: string;
  region: string;
  pestle: string;
  source: string;
  swot: string;
  country: string;
  city: string;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    topics: [],
    sectors: [],
    regions: [],
    pestles: [],
    sources: [],
    countries: [],
    cities: [],
    swots: [],
    endYears: [],
  });

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get('/api/filters');
      if (response.data.success) {
        setFilterOptions(response.data.filters);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [key]: value,
      };
      console.log('Filter changed:', key, '=', value, 'New filters:', newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
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
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-gray-500">Loading filters...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* End Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Year
          </label>
          <select
            value={filters.endYear}
            onChange={(e) => handleFilterChange('endYear', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Years</option>
            {filterOptions.endYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic
          </label>
          <select
            value={filters.topic}
            onChange={(e) => handleFilterChange('topic', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Topics</option>
            {filterOptions.topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sector
          </label>
          <select
            value={filters.sector}
            onChange={(e) => handleFilterChange('sector', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Sectors</option>
            {filterOptions.sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Regions</option>
            {filterOptions.regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* PEST Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PEST
          </label>
          <select
            value={filters.pestle}
            onChange={(e) => handleFilterChange('pestle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All PEST</option>
            {filterOptions.pestles.map((pestle) => (
              <option key={pestle} value={pestle}>
                {pestle}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Sources</option>
            {filterOptions.sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* SWOT Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SWOT
          </label>
          <select
            value={filters.swot}
            onChange={(e) => handleFilterChange('swot', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All SWOT</option>
            {filterOptions.swots.map((swot) => (
              <option key={swot} value={swot}>
                {swot}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Countries</option>
            {filterOptions.countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Cities</option>
            {filterOptions.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

