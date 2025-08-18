import React, { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon, MapPinIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PublicWarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    warehouseType: '',
    listingType: '',
    city: '',
    minArea: '',
    maxArea: ''
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const response = await apiService.public.getWarehouses(searchFilters);
      if (response.data.success) {
        setWarehouses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWarehouses(filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      warehouseType: '',
      listingType: '',
      city: '',
      minArea: '',
      maxArea: ''
    };
    setFilters(clearedFilters);
    fetchWarehouses();
  };

  const getImageUrl = (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return 'https://vijayg.dev/warehouse-listing/uploads/default.jpg';
    }
    
    const image = images[0];
    if (!image) return 'https://vijayg.dev/warehouse-listing/uploads/default.jpg';
    
    // The API now returns full URLs, so return them as-is
    return image;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading warehouses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navbar - only show for non-authenticated users */}
      {!user && (
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Warehouse Platform
              </Link>
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
                <Link to="/warehouses" className="text-blue-600 font-medium">
                  Browse Warehouses
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Warehouses</h1>
          <p className="text-gray-600">Browse warehouses available for rent or purchase</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by name, location..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <select 
                  name="warehouseType"
                  value={filters.warehouseType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Warehouse Type</option>
                  <option value="Standard or General Storage">Standard Storage</option>
                  <option value="Hazardous Chemicals Storage">Hazardous Chemicals</option>
                  <option value="Climate Controlled Storage">Climate Controlled</option>
                </select>
              </div>
              <div>
                <select 
                  name="listingType"
                  value={filters.listingType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Listing Type</option>
                  <option value="Rent">For Rent</option>
                  <option value="Sale">For Sale</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="minArea"
                  value={filters.minArea}
                  onChange={handleFilterChange}
                  placeholder="Min Area (sq ft)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <SearchIcon className="w-4 h-4" />
                Search
              </button>
              <button 
                type="button"
                onClick={clearFilters}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FilterIcon className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Available Warehouses</h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{warehouses.length} warehouses found</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {warehouses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {warehouses.map((warehouse) => (
                  <div key={warehouse.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Image Section */}
                    <div className="relative h-48">
                      <img
                        src={getImageUrl(warehouse.images)}
                        alt={warehouse.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://vijayg.dev/warehouse-listing/uploads/default.jpg';
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {warehouse.listing_for || 'Available'}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{warehouse.name}</h3>
                      
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{warehouse.city}, {warehouse.state}</span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-gray-900 text-right">{warehouse.warehouse_type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-medium text-gray-900">{warehouse.build_up_area?.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Views:</span>
                          <span className="font-medium text-gray-900">{warehouse.views || 0}</span>
                        </div>
                      </div>

                      {warehouse.listing_for === 'Rent' && warehouse.rent && (
                        <div className="mb-4">
                          <span className="text-xl font-bold text-blue-600">₹{warehouse.rent.toLocaleString()}</span>
                          <span className="text-gray-600 text-sm">/month</span>
                        </div>
                      )}

                      <Link
                        to={`/warehouse/${warehouse.id}`}
                        className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No warehouses available</h3>
                <p className="text-gray-600">
                  Check back later for new warehouse listings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicWarehousesPage;