import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, EyeIcon, EditIcon, TrashIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchWarehouses();
  }, [filters]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const params = {
        status: filters.status !== 'all' ? filters.status : undefined,
        search: filters.search || undefined
      };
      const response = await apiService.warehouses.getMy(params);
      if (response.data.success) {
        setWarehouses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast.error('Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': { class: 'bg-orange-100 text-orange-800', icon: ClockIcon, text: 'Pending' },
      'approved': { class: 'bg-green-100 text-green-800', icon: CheckIcon, text: 'Approved' },
      'rejected': { class: 'bg-red-100 text-red-800', icon: XIcon, text: 'Rejected' }
    };
    
    const badge = badges[status] || badges['pending'];
    const IconComponent = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.class}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {badge.text}
      </span>
    );
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

  // Note: Pending warehouses are excluded from the default view
  const stats = {
    totalWarehouses: warehouses.length,
    approvedWarehouses: warehouses.filter(w => w.approval_status === 'approved').length,
    rejectedWarehouses: warehouses.filter(w => w.approval_status === 'rejected').length
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Warehouses</h1>
            <p className="text-gray-600">Manage your warehouse listings</p>
          </div>
          <Link
            to="/user/warehouses/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Warehouse
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Warehouse Listings</h2>
              <div className="flex items-center gap-4">
                <select 
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <input
                  type="text"
                  placeholder="Search warehouses..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading warehouses...</p>
              </div>
            ) : warehouses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {warehouses.map((warehouse) => (
                  <div key={warehouse.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                        {getStatusBadge(warehouse.approval_status)}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{warehouse.name}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-gray-900">{warehouse.warehouse_type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-medium text-gray-900">{warehouse.build_up_area?.toLocaleString()} sq ft</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium text-gray-900">{warehouse.city}</span>
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

                      <div className="flex items-center justify-between">
                        <Link
                          to={`/user/warehouses/${warehouse.id}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View
                        </Link>
                        <Link
                          to={`/user/warehouses/${warehouse.id}/edit`}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                        >
                          <EditIcon className="w-4 h-4" />
                          Edit
                        </Link>
                      </div>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No warehouses yet</h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first warehouse listing.
                </p>
                <Link
                  to="/user/warehouses/new"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create Your First Warehouse
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Listings</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalWarehouses}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved Listings</h3>
            <p className="text-3xl font-bold text-green-600">{stats.approvedWarehouses}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">{stats.rejectedWarehouses}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehousesPage;