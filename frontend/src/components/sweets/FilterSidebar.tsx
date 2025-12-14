import React from 'react';
import type { SearchParams } from '../../services/sweetService';

interface FilterSidebarProps {
  filters: SearchParams;
  setFilters: React.Dispatch<React.SetStateAction<SearchParams>>;
  totalResults: number;
}

const CATEGORIES = ['All', 'Chocolates', 'Gummies', 'Hard Candies', 'Lollipops', 'Bars', 'Other'];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, totalResults }) => {
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ 
        ...prev, 
        [name]: value === '' ? undefined : Number(value) 
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      minPrice: undefined,
      maxPrice: undefined,
      name: filters.name // keep search term or clear it? Context says "Clear All Filters", usually implies everything except maybe text if text is separate. Let's clear everything but text search usually dominates. I'll clear all except text if text is in header. Wait, text is in header. So only sidebar filters.
    });
  };

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
        <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
           {totalResults} results
        </span>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <div className="relative">
            <select
              value={filters.category || 'All'}
              onChange={handleCategoryChange}
              className="w-full pl-3 pr-10 py-2 text-base border-white/30 focus:outline-none focus:ring-primary focus:border-transparent sm:text-sm rounded-lg bg-white/40 hover:bg-white/50 transition-colors cursor-pointer appearance-none border"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">Price Range</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Min</label>
            <input
              type="number"
              name="minPrice"
              min="0"
              placeholder="0"
              value={filters.minPrice ?? ''}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 border border-white/30 rounded-lg focus:ring-primary focus:border-primary text-sm bg-white/40"
            />
          </div>
          <span className="text-gray-400 mt-4">-</span>
          <div className="flex-1">
             <label className="text-xs text-gray-500 mb-1 block">Max</label>
            <input
              type="number"
              name="maxPrice"
              min="0"
              placeholder="Max"
              value={filters.maxPrice ?? ''}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 border border-white/30 rounded-lg focus:ring-primary focus:border-primary text-sm bg-white/40"
            />
          </div>
        </div>
      </div>

      {/* Active Filters / Clear */}
      {(filters.category !== 'All' || filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={clearFilters}
            className="w-full py-2 text-sm text-error hover:text-red-700 font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
