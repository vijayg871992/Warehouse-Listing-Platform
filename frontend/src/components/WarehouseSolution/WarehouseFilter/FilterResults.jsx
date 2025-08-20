import React from 'react';
import { MapPinIcon, EyeIcon, HeartIcon, ShareIcon } from 'lucide-react';

const FilterResults = ({ 
  warehouses = [], 
  loading = false, 
  onViewDetails, 
  onContact, 
  onSaveToFavorites,
  onShare,
  sortBy,
  onSortChange
}) => {
  // Sample data for demonstration
  const sampleWarehouses = [
    {
      id: '1',
      name: 'Premium Storage Facility',
      address: 'Industrial Area, Sector 18, Gurgaon, Haryana',
      warehouse_type: 'Standard Storage',
      build_up_area: 5000,
      total_plot_area: 8000,
      listing_for: 'Rent',
      rent: 50000,
      deposit: 100000,
      images: [],
      views: 1250,
      owner_name: 'Rajesh Kumar',
      ownership_type: 'Owner',
      created_at: '2024-01-15',
      approval_status: 'approved'
    },
    {
      id: '2',
      name: 'Climate Controlled Warehouse',
      address: 'Logistics Hub, Phase 2, Delhi NCR',
      warehouse_type: 'Climate Controlled',
      build_up_area: 8000,
      total_plot_area: 12000,
      listing_for: 'Rent',
      rent: 75000,
      deposit: 150000,
      images: [],
      views: 890,
      owner_name: 'Priya Sharma',
      ownership_type: 'Owner',
      created_at: '2024-01-12',
      approval_status: 'approved'
    },
    {
      id: '3',
      name: 'Industrial Storage Complex',
      address: 'MIDC Area, Pune, Maharashtra',
      warehouse_type: 'Standard Storage',
      build_up_area: 10000,
      total_plot_area: 15000,
      listing_for: 'Sale',
      rent: 0,
      deposit: 0,
      sale_price: 2500000,
      images: [],
      views: 567,
      owner_name: 'Amit Patel',
      ownership_type: 'Broker',
      created_at: '2024-01-10',
      approval_status: 'approved'
    }
  ];

  const warehouseData = warehouses.length > 0 ? warehouses : sampleWarehouses;

  const sortedWarehouses = [...warehouseData].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'price-low':
        return (a.rent || a.sale_price || 0) - (b.rent || b.sale_price || 0);
      case 'price-high':
        return (b.rent || b.sale_price || 0) - (a.rent || a.sale_price || 0);
      case 'area':
        return b.build_up_area - a.build_up_area;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const formatPrice = (warehouse) => {
    if (warehouse.listing_for === 'Rent') {
      return `₹${warehouse.rent.toLocaleString()}/month`;
    } else {
      return `₹${(warehouse.sale_price || 0).toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching warehouses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Results Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Search Results ({sortedWarehouses.length} warehouses found)
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="area">Area: Large to Small</option>
              <option value="views">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="p-6">
        {sortedWarehouses.length > 0 ? (
          <div className="space-y-6">
            {sortedWarehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 flex items-center justify-center">
                    {warehouse.images && warehouse.images.length > 0 ? (
                      <img
                        src={warehouse.images[0]}
                        alt={warehouse.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-2">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No image</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {warehouse.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPinIcon className="w-4 h-4" />
                          <span className="text-sm">{warehouse.address}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onShare && onShare(warehouse.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Share"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSaveToFavorites && onSaveToFavorites(warehouse.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Save to favorites"
                        >
                          <HeartIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-medium text-gray-900">{warehouse.warehouse_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Built-up Area</p>
                        <p className="font-medium text-gray-900">{warehouse.build_up_area.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Area</p>
                        <p className="font-medium text-gray-900">{warehouse.total_plot_area.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Listing For</p>
                        <p className="font-medium text-gray-900">{warehouse.listing_for}</p>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(warehouse)}
                        </p>
                        {warehouse.listing_for === 'Rent' && warehouse.deposit && (
                          <p className="text-sm text-gray-600">
                            Deposit: ₹{warehouse.deposit.toLocaleString()}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <EyeIcon className="w-3 h-3" />
                            <span>{warehouse.views} views</span>
                          </div>
                          <span>Listed by {warehouse.owner_name} ({warehouse.ownership_type})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onContact && onContact(warehouse.id)}
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
                        >
                          Contact
                        </button>
                        <button
                          onClick={() => onViewDetails && onViewDetails(warehouse.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No warehouses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse our popular locations.
            </p>
          </div>
        )}

        {/* Pagination */}
        {sortedWarehouses.length > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button 
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                disabled
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">1</span>
              <button 
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterResults;