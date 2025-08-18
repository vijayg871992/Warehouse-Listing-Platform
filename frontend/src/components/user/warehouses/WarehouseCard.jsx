import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Edit, 
  Trash2, 
  MapPin, 
  Building, 
  DollarSign, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { apiService } from '../../../services/api';
import { BACKEND_URL } from '../../../config/api';

const WarehouseCard = ({ 
  warehouse, 
  onEdit, 
  onDelete, 
  onView,
  showActions = true,
  isOwner = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get the first image or use fallback
  const getImageSrc = () => {
    if (imageError || !warehouse.images || warehouse.images.length === 0) {
      return '/api/placeholder/400/250?text=No+Image';
    }
    
    const firstImage = warehouse.images[0];
    // Check if it's a full URL or relative path
    if (firstImage.startsWith('http')) {
      return firstImage;
    }
    return `${BACKEND_URL}/uploads/${firstImage}`;
  };

  // Get status badge configuration
  const getStatusBadge = () => {
    switch (warehouse.approval_status?.toLowerCase()) {
      case 'approved':
        return {
          icon: CheckCircle,
          text: 'Approved',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600'
        };
      case 'rejected':
        return {
          icon: X,
          text: 'Rejected',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        };
      case 'pending':
      default:
        return {
          icon: Clock,
          text: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600'
        };
    }
  };

  // Handle delete action
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await apiService.warehouses.delete(warehouse.id);
      setShowDeleteModal(false);
      if (onDelete) {
        onDelete(warehouse.id);
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      // You might want to show a toast notification here
      alert('Failed to delete warehouse. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit action
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(warehouse);
    }
  };

  // Handle card click for viewing details
  const handleCardClick = () => {
    if (onView) {
      onView(warehouse);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Price on request';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format area
  const formatArea = (area) => {
    if (!area) return 'N/A';
    return `${area.toLocaleString()} sq ft`;
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageSrc()}
            alt={warehouse.name || 'Warehouse'}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
          
          {/* Status Badge */}
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.bgColor} ${statusBadge.textColor}`}>
            <StatusIcon className={`w-3 h-3 ${statusBadge.iconColor}`} />
            {statusBadge.text}
          </div>


          {/* Action Buttons */}
          {showActions && isOwner && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                onClick={handleEditClick}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                title="Edit warehouse"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                title="Delete warehouse"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Type */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {warehouse.name || 'Unnamed Warehouse'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building className="w-4 h-4" />
              <span>{warehouse.warehouse_type || 'Standard Storage'}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {[warehouse.city, warehouse.state].filter(Boolean).join(', ') || 'Location not specified'}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
            <div>
              <span className="text-gray-500">Area:</span>
              <div className="font-medium text-gray-900">
                {formatArea(warehouse.build_up_area)}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <div className="font-medium text-gray-900">
                {warehouse.listing_for || 'N/A'}
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-500">
                  {warehouse.listing_for === 'Rent' ? 'Rent:' : 'Price:'}
                </span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(warehouse.rent || warehouse.price)}
                {warehouse.listing_for === 'Rent' && (
                  <span className="text-sm font-normal text-gray-500">/month</span>
                )}
              </div>
            </div>
            
            {/* Deposit information for rent */}
            {warehouse.listing_for === 'Rent' && warehouse.deposit && (
              <div className="text-xs text-gray-500 text-right mt-1">
                Deposit: {formatCurrency(warehouse.deposit)}
              </div>
            )}
          </div>

          {/* Owner Information */}
          {warehouse.ownership_type && (
            <div className="mt-3 pt-3 border-t">
              <div className="text-xs text-gray-500">
                Listed by: <span className="font-medium">{warehouse.ownership_type}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Warehouse
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>"{warehouse.name}"</strong>? 
              This will permanently remove the warehouse listing and all associated data.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

WarehouseCard.propTypes = {
  warehouse: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    approval_status: PropTypes.oneOf(['pending', 'approved', 'rejected']),
    images: PropTypes.arrayOf(PropTypes.string),
    warehouse_type: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    build_up_area: PropTypes.number,
    listing_for: PropTypes.oneOf(['Rent', 'Sale']),
    rent: PropTypes.number,
    price: PropTypes.number,
    deposit: PropTypes.number,
    ownership_type: PropTypes.oneOf(['Broker', 'Owner']),
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  showActions: PropTypes.bool,
  isOwner: PropTypes.bool,
};

export default WarehouseCard;