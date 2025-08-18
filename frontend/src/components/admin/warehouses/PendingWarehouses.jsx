import React, { useState, useEffect } from 'react';
import { CheckIcon, XIcon, EyeIcon, MessageCircleIcon, ClockIcon, ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../../../services/api';

const PendingWarehouses = ({ onApprove, onReject, onViewDetails }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending warehouses from API
  useEffect(() => {
    fetchPendingWarehouses();
  }, []);

  const fetchPendingWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.admin.getPendingWarehouses();
      if (response.data.success) {
        setWarehouses(response.data.data.warehouses || []);
      } else {
        setError('Failed to fetch pending warehouses');
      }
    } catch (err) {
      console.error('Error fetching pending warehouses:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending warehouses');
    } finally {
      setLoading(false);
    }
  };

  const pendingWarehouses = warehouses.filter(w => w.approval_status === 'pending');

  const handleApprove = async (warehouseId) => {
    try {
      const response = await apiService.admin.approveWarehouse(warehouseId, '');
      if (response.data.success) {
        // Refresh the list after approval
        await fetchPendingWarehouses();
        if (onApprove) {
          onApprove(warehouseId);
        }
      }
    } catch (err) {
      console.error('Error approving warehouse:', err);
      alert(err.response?.data?.message || 'Failed to approve warehouse');
    }
  };

  const handleReject = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (selectedWarehouse && rejectionReason.trim()) {
      try {
        const response = await apiService.admin.rejectWarehouse(selectedWarehouse.id, rejectionReason);
        if (response.data.success) {
          // Refresh the list after rejection
          await fetchPendingWarehouses();
          if (onReject) {
            onReject(selectedWarehouse.id, rejectionReason);
          }
        }
        setShowRejectModal(false);
        setSelectedWarehouse(null);
        setRejectionReason('');
      } catch (err) {
        console.error('Error rejecting warehouse:', err);
        alert(err.response?.data?.message || 'Failed to reject warehouse');
      }
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending warehouses...</p>
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
            onClick={fetchPendingWarehouses}
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
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/admin/warehouses"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to All Warehouses
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Warehouse Approvals</h1>
          <p className="text-gray-600">Review and approve warehouse listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600">{pendingWarehouses.length}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-3xl font-bold text-blue-600">{warehouses.length}</p>
              </div>
              <EyeIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Today</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected Today</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <XIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Pending Warehouses List */}
        {pendingWarehouses.length > 0 ? (
          <div className="space-y-6">
            {pendingWarehouses.map((warehouse) => (
              <div key={warehouse.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {warehouse.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Owner:</strong> {warehouse.owner ? `${warehouse.owner.firstName} ${warehouse.owner.lastName}` : 'N/A'} ({warehouse.ownership_type || 'N/A'})</p>
                          <p><strong>Email:</strong> {warehouse.owner?.email || warehouse.email || 'N/A'}</p>
                          <p><strong>Phone:</strong> {warehouse.mobile_number || 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>Type:</strong> {warehouse.warehouse_type || 'N/A'}</p>
                          <p><strong>Area:</strong> {warehouse.build_up_area ? warehouse.build_up_area.toLocaleString() : 'N/A'} sq ft</p>
                          <p><strong>Listing:</strong> {warehouse.listing_for || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        Pending
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted: {formatDate(warehouse.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">
                      <strong>Location:</strong> {warehouse.address}
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
                              src={image}
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

                  {warehouse.listing_for === 'Rent' && (
                    <div className="mb-4 bg-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Monthly Rent</p>
                          <p className="text-lg font-semibold text-blue-600">
                            ₹{warehouse.rent?.toLocaleString() || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Security Deposit</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{warehouse.deposit?.toLocaleString() || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <button
                      onClick={() => onViewDetails && onViewDetails(warehouse.id)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View Details
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReject(warehouse)}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(warehouse.id)}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
            <p className="text-gray-600">All warehouse submissions have been reviewed.</p>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reject Warehouse</h3>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  You are rejecting: <strong>{selectedWarehouse?.name}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Please provide a reason for rejection. This will be sent to the warehouse owner.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Please explain why this warehouse listing is being rejected..."
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectionReason.trim()}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XIcon className="w-4 h-4" />
                  Reject Warehouse
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingWarehouses;