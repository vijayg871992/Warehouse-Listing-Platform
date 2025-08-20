import React, { useState } from 'react';
import { SearchIcon, FilterIcon, PlusIcon, EyeIcon } from 'lucide-react';
import WarehouseCard from './WarehouseCard';

const WarehouseList = ({ warehouses = [], onCreateNew, onViewDetails, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Sample data for demonstration
  const sampleWarehouses = [
    {
      id: '1',
      name: 'Modern Storage Facility',
      approval_status: 'approved',
      address: 'Industrial Area, Mumbai, Maharashtra',
      warehouse_type: 'Standard Storage',
      build_up_area: 5000,
      listing_for: 'Rent',
      rent: 50000,
      images: [],
      views: 120,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Climate Controlled Warehouse',
      approval_status: 'pending',
      address: 'Logistics Hub, Delhi, NCR',
      warehouse_type: 'Climate Controlled',
      build_up_area: 8000,
      listing_for: 'Rent',
      rent: 75000,
      images: [],
      views: 85,
      created_at: '2024-01-10'
    }
  ];

  const warehouseData = warehouses.length > 0 ? warehouses : sampleWarehouses;

  const filteredWarehouses = warehouseData.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || warehouse.approval_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedWarehouses = [...filteredWarehouses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'area':
        return b.build_up_area - a.build_up_area;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600',
      approved: 'text-green-600',
      rejected: 'text-red-600'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Warehouses</h1>
            <p className="text-gray-600">Manage your warehouse listings</p>
          </div>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Warehouse
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search warehouses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="area">Largest Area</option>
                <option value="views">Most Views</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{warehouseData.length}</p>
                <p className="text-gray-600 text-sm">Total Warehouses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {warehouseData.filter(w => w.approval_status === 'approved').length}
                </p>
                <p className="text-gray-600 text-sm">Approved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {warehouseData.filter(w => w.approval_status === 'pending').length}
                </p>
                <p className="text-gray-600 text-sm">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {warehouseData.reduce((sum, w) => sum + w.views, 0)}
                </p>
                <p className="text-gray-600 text-sm">Total Views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {sortedWarehouses.length} of {warehouseData.length} warehouses
          </p>
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {statusFilter !== 'all' && `Filtered by: ${statusFilter}`}
              {searchTerm && ` | Search: "${searchTerm}"`}
            </span>
          </div>
        </div>

        {/* Warehouse Grid */}
        {sortedWarehouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWarehouses.map((warehouse) => (
              <WarehouseCard
                key={warehouse.id}
                warehouse={warehouse}
                onView={() => onViewDetails(warehouse.id)}
                onEdit={() => onEdit(warehouse.id)}
                onDelete={() => onDelete(warehouse.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No warehouses found' : 'No warehouses yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first warehouse listing'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <button
                onClick={onCreateNew}
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Create Your First Warehouse
              </button>
            )}
          </div>
        )}

        {/* Pagination (if needed) */}
        {sortedWarehouses.length > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-md">1</span>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseList;