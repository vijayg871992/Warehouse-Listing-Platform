import React, { useState } from 'react';
import FilterBar from '../components/WarehouseSolution/WarehouseFilter/FilterBar';
import FilterResults from '../components/WarehouseSolution/WarehouseFilter/FilterResults';
import { useNavigate } from 'react-router-dom';

const WarehouseSolutions: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: '',
    warehouse_type: '',
    listing_for: '',
    min_area: '',
    max_area: '',
    min_rent: '',
    max_rent: '',
    plot_status: ''
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSearch = async (searchFilters: any) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real application, this would make an API call to search warehouses
      console.log('Searching with filters:', searchFilters);
      setSearchResults([]); // This would be populated with actual results
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setSearchResults([]);
  };

  const handleViewDetails = (warehouseId: string) => {
    navigate(`/warehouse/${warehouseId}`);
  };

  const handleContact = (warehouseId: string) => {
    // Handle contact functionality
    console.log('Contact warehouse:', warehouseId);
  };

  const handleSaveToFavorites = (warehouseId: string) => {
    // Handle save to favorites
    console.log('Save to favorites:', warehouseId);
  };

  const handleShare = (warehouseId: string) => {
    // Handle share functionality
    console.log('Share warehouse:', warehouseId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Warehouse
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover premium warehouse spaces for rent and sale across India. 
              Connect with verified owners and brokers.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={handleReset}
          isAdvancedOpen={isAdvancedOpen}
          onToggleAdvanced={() => setIsAdvancedOpen(!isAdvancedOpen)}
        />

        {/* Search Results */}
        <FilterResults
          warehouses={searchResults}
          loading={loading}
          onViewDetails={handleViewDetails}
          onContact={handleContact}
          onSaveToFavorites={handleSaveToFavorites}
          onShare={handleShare}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-gray-600">All warehouse listings are verified by our team to ensure authenticity and quality.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Search</h3>
              <p className="text-gray-600">Find the perfect warehouse quickly with our advanced search and filtering options.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Contact</h3>
              <p className="text-gray-600">Connect directly with warehouse owners and brokers without any intermediaries.</p>
            </div>
          </div>
        </div>

        {/* Popular Locations */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Popular Warehouse Locations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { city: 'Mumbai', count: 150 },
              { city: 'Delhi', count: 120 },
              { city: 'Bangalore', count: 95 },
              { city: 'Chennai', count: 80 },
              { city: 'Pune', count: 75 },
              { city: 'Hyderabad', count: 65 },
              { city: 'Gurgaon', count: 55 },
              { city: 'Noida', count: 45 }
            ].map((location) => (
              <button
                key={location.city}
                onClick={() => {
                  setFilters({ ...filters, location: location.city });
                  handleSearch({ ...filters, location: location.city });
                }}
                className="text-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{location.city}</h3>
                <p className="text-sm text-gray-600">{location.count} warehouses</p>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have a Warehouse to List?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of warehouse owners and brokers who trust our platform to reach more customers.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            List Your Warehouse
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseSolutions;