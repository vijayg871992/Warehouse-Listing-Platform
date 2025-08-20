import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, TrashIcon, CheckIcon, XIcon, ClockIcon, FilterIcon } from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const AdminWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchWarehouses();
  }, [filters, pagination.currentPage]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        status: filters.status,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };
      
      const response = await apiService.admin.getAllWarehouses(params);
      if (response.data.success) {
        setWarehouses(response.data.data.warehouses || []);
        setPagination(response.data.data.pagination);
      } else {
        setError('Failed to fetch warehouses');
      }
    } catch (err) {
      console.error('Error fetching warehouses:', err);
      setError(err.response?.data?.message || 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setFilters(prev => ({ ...prev, status: newStatus }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleDelete = async (warehouseId) => {
    if (window.confirm('Are you sure you want to delete this warehouse? This action cannot be undone.')) {
      try {
        
        // Show loading toast
        const loadingToast = toast.loading('Deleting warehouse...');
        
        const response = await apiService.admin.deleteWarehouse(warehouseId);
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        if (response.data && response.data.success) {
          setWarehouses(prev => prev.filter(w => w.id !== warehouseId));
          toast.success('Warehouse deleted successfully');
          // Refresh the list to ensure consistency
          await fetchWarehouses();
        } else {
          toast.error(response.data?.message || 'Failed to delete warehouse');
        }
      } catch (err) {
        console.error('Error deleting warehouse:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);
        toast.dismiss(); // Dismiss any loading toasts
        
        if (err.response?.status === 401) {
          toast.error('Unauthorized. Please login again.');
        } else if (err.response?.status === 403) {
          toast.error('Access denied. Admin privileges required.');
        } else if (err.response?.status === 404) {
          toast.error('Warehouse not found.');
        } else {
          toast.error(err.response?.data?.message || err.message || 'Failed to delete warehouse');
        }
      }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (images, index = 0) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return 'https://vijayg.dev/warehouse-listing/uploads/default.jpg';
    }
    
    const image = images[index];
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button 
            onClick={fetchWarehouses}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Warehouses</h1>
          <p className="text-gray-600">Manage all warehouse listings on the platform</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search warehouses..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Link
                to="/admin/warehouses/pending"
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Pending Approvals
              </Link>
            </div>
          </div>
        </div>

        {/* Warehouses List */}
        {warehouses.length > 0 ? (
          <div className="space-y-6">
            {warehouses.map((warehouse) => (
              <div key={warehouse.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {warehouse.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Owner:</strong> {warehouse.owner ? `${warehouse.owner.firstName} ${warehouse.owner.lastName}` : 'N/A'}</p>
                          <p><strong>Email:</strong> {warehouse.owner?.email || 'N/A'}</p>
                          <p><strong>Type:</strong> {warehouse.warehouse_type || 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>City:</strong> {warehouse.city || 'N/A'}</p>
                          <p><strong>Area:</strong> {warehouse.build_up_area ? warehouse.build_up_area.toLocaleString() : 'N/A'} sq ft</p>
                          <p><strong>Views:</strong> {warehouse.views || 0}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(warehouse.approval_status)}
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {formatDate(warehouse.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">
                      <strong>Location:</strong> {warehouse.address || 'N/A'}
                    </p>
                  </div>

                  {/* Images Section */}
                  {warehouse.images && warehouse.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Images:</p>
                      <div className="flex gap-2 overflow-x-auto">
                        {warehouse.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={getImageUrl(warehouse.images, index)}
                              alt={`${warehouse.name} image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://vijayg.dev/warehouse-listing/uploads/default.jpg';
                              }}
                            />
                          </div>
                        ))}
                        {warehouse.images.length > 4 && (
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{warehouse.images.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      ID: {warehouse.id}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/warehouses/${warehouse.id}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDelete(warehouse.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FilterIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No warehouses found</h3>
            <p className="text-gray-600">No warehouses match your current filters.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-4">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
            </span>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWarehouses;