import React from 'react';
import { ArrowLeftIcon, EditIcon, TrashIcon, EyeIcon, MapPinIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const WarehouseDetail = ({ warehouse, onEdit, onDelete, onBack }) => {
  const defaultWarehouse = {
    id: '1',
    name: 'Sample Warehouse',
    approval_status: 'pending',
    address: 'Sample Address, City, State',
    warehouse_type: 'Standard Storage',
    build_up_area: 5000,
    total_plot_area: 8000,
    listing_for: 'Rent',
    rent: 50000,
    deposit: 100000,
    images: [],
    mobile_number: '+91 9876543210',
    email: 'owner@example.com',
    ownership_type: 'Owner',
    description: 'This is a sample warehouse description with all the necessary details.',
    created_at: '2024-01-15'
  };

  const warehouseData = warehouse || defaultWarehouse;

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Warehouses
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(warehouseData.id)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <EditIcon className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(warehouseData.id)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="h-64 md:h-96 bg-gray-200 flex items-center justify-center">
            {warehouseData.images && warehouseData.images.length > 0 ? (
              <img 
                src={warehouseData.images[0]} 
                alt={warehouseData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No images uploaded</p>
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Title and Status */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {warehouseData.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{warehouseData.address}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(warehouseData.approval_status)}`}>
                  {warehouseData.approval_status.charAt(0).toUpperCase() + warehouseData.approval_status.slice(1)}
                </span>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Built-up Area</p>
                <p className="text-lg font-semibold text-gray-900">{warehouseData.build_up_area.toLocaleString()} sq ft</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Area</p>
                <p className="text-lg font-semibold text-gray-900">{warehouseData.total_plot_area.toLocaleString()} sq ft</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Type</p>
                <p className="text-lg font-semibold text-gray-900">{warehouseData.warehouse_type}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Listing For</p>
                <p className="text-lg font-semibold text-gray-900">{warehouseData.listing_for}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {warehouseData.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="mb-8 bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Monthly Rent</p>
                  <p className="text-2xl font-bold text-blue-600">₹{warehouseData.rent?.toLocaleString() || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Security Deposit</p>
                  <p className="text-2xl font-bold text-gray-900">₹{warehouseData.deposit?.toLocaleString() || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{warehouseData.mobile_number}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{warehouseData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ownership Type</p>
                  <p className="text-lg font-semibold text-gray-900">{warehouseData.ownership_type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Listed On</p>
                  <p className="text-lg font-semibold text-gray-900">{new Date(warehouseData.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDetail;