import React from 'react';
import { SearchIcon, FilterIcon, MapPinIcon } from 'lucide-react';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onReset,
  isAdvancedOpen,
  onToggleAdvanced 
}) => {
  const handleInputChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: '',
      warehouse_type: '',
      listing_for: '',
      min_area: '',
      max_area: '',
      min_rent: '',
      max_rent: '',
      plot_status: ''
    };
    onFilterChange(resetFilters);
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Primary Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location, city, or area..."
              value={filters.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        
        <div>
          <select
            value={filters.warehouse_type || ''}
            onChange={(e) => handleInputChange('warehouse_type', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Warehouse Type</option>
            <option value="Standard or General Storage">Standard Storage</option>
            <option value="Hazardous Chemicals Storage">Hazardous Chemicals</option>
            <option value="Climate Controlled Storage">Climate Controlled</option>
          </select>
        </div>

        <div>
          <select
            value={filters.listing_for || ''}
            onChange={(e) => handleInputChange('listing_for', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Listing Type</option>
            <option value="Rent">For Rent</option>
            <option value="Sale">For Sale</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="border-t pt-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Area Range */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Built-up Area (sq ft)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min_area || ''}
                  onChange={(e) => handleInputChange('min_area', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_area || ''}
                  onChange={(e) => handleInputChange('max_area', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Rent Range */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Monthly Rent (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min_rent || ''}
                  onChange={(e) => handleInputChange('min_rent', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_rent || ''}
                  onChange={(e) => handleInputChange('max_rent', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Plot Status */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Plot Status
              </label>
              <select
                value={filters.plot_status || ''}
                onChange={(e) => handleInputChange('plot_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Any Status</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Residential">Residential</option>
              </select>
            </div>
          </div>

          {/* Popular Locations */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Locations</h4>
            <div className="flex flex-wrap gap-2">
              {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Gurgaon', 'Noida'].map((city) => (
                <button
                  key={city}
                  onClick={() => handleInputChange('location', city)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.location === city
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleAdvanced}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm"
        >
          <FilterIcon className="w-4 h-4" />
          {isAdvancedOpen ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
          >
            Reset Filters
          </button>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <SearchIcon className="w-4 h-4" />
            Search Warehouses
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {Object.values(filters).some(value => value) && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => 
              value && (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {`${key.replace('_', ' ')}: ${value}`}
                  <button
                    onClick={() => handleInputChange(key, '')}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;