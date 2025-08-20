import React, { useState } from 'react';
import { ArrowLeftIcon, MapPinIcon, PhoneIcon, MailIcon, ShareIcon, HeartIcon, EyeIcon } from 'lucide-react';

interface WarehouseDetailsProps {
  warehouse?: any;
  onBack?: () => void;
  onContact?: (warehouseId: string) => void;
  onScheduleVisit?: (warehouseId: string) => void;
  onShare?: (warehouseId: string) => void;
  onSaveToFavorites?: (warehouseId: string) => void;
}

const WarehouseDetails: React.FC<WarehouseDetailsProps> = ({
  warehouse,
  onBack,
  onContact,
  onScheduleVisit,
  onShare,
  onSaveToFavorites
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  // Sample data for demonstration
  const defaultWarehouse = {
    id: '1',
    name: 'Premium Storage Facility',
    address: 'Industrial Area, Sector 18, Gurgaon, Haryana 122015',
    city: 'Gurgaon',
    state: 'Haryana',
    warehouse_type: 'Standard Storage',
    build_up_area: 5000,
    total_plot_area: 8000,
    total_parking_area: 500,
    listing_for: 'Rent',
    rent: 50000,
    deposit: 100000,
    plinth_height: 12,
    dock_doors: 4,
    electricity_kva: 100,
    plot_status: 'Commercial',
    ownership_type: 'Owner',
    owner_name: 'Rajesh Kumar',
    mobile_number: '+91 9876543210',
    email: 'rajesh.kumar@example.com',
    description: 'Modern warehouse facility with state-of-the-art infrastructure. Perfect for logistics and storage operations. Features include 24/7 security, CCTV surveillance, fire safety systems, and excellent connectivity to major highways.',
    images: [],
    views: 1250,
    created_at: '2024-01-15',
    features: [
      'Loading Dock Available',
      '24/7 Security',
      'CCTV Surveillance',
      'Fire Safety System',
      'Power Backup',
      'Office Space Included',
      'Parking Available',
      'Highway Connectivity'
    ]
  };

  const warehouseData = warehouse || defaultWarehouse;

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!warehouseData.images || warehouseData.images.length === 0) return;
    
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? warehouseData.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === warehouseData.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Warehouses
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-64 md:h-96 bg-gray-200">
            {warehouseData.images && warehouseData.images.length > 0 ? (
              <>
                <img 
                  src={warehouseData.images[currentImageIndex]} 
                  alt={warehouseData.name}
                  className="w-full h-full object-cover"
                />
                {warehouseData.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleImageNavigation('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {warehouseData.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No images available</p>
                </div>
              </div>
            )}
            
            {/* Action buttons overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => onShare && onShare(warehouseData.id)}
                className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-opacity"
              >
                <ShareIcon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => onSaveToFavorites && onSaveToFavorites(warehouseData.id)}
                className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-opacity"
              >
                <HeartIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Details */}
              <div className="lg:col-span-2">
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
                  <div className="flex items-center gap-1 text-gray-600">
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">{warehouseData.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Key Specifications */}
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

                {/* Features & Amenities */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {warehouseData.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Plinth Height</p>
                      <p className="font-semibold">{warehouseData.plinth_height} ft</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dock Doors</p>
                      <p className="font-semibold">{warehouseData.dock_doors}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Electricity</p>
                      <p className="font-semibold">{warehouseData.electricity_kva} KVA</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Plot Status</p>
                      <p className="font-semibold">{warehouseData.plot_status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Parking Area</p>
                      <p className="font-semibold">{warehouseData.total_parking_area} sq ft</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Listed On</p>
                      <p className="font-semibold">{new Date(warehouseData.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Pricing Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  {/* Pricing */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ₹{warehouseData.rent.toLocaleString()} / month
                    </h3>
                    <p className="text-gray-600">Security Deposit: ₹{warehouseData.deposit.toLocaleString()}</p>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Owner</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">{warehouseData.mobile_number}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MailIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">{warehouseData.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => onContact && onContact(warehouseData.id)}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Contact Owner
                    </button>
                    <button
                      onClick={() => onScheduleVisit && onScheduleVisit(warehouseData.id)}
                      className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-md font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Schedule Visit
                    </button>
                    <button
                      onClick={() => onSaveToFavorites && onSaveToFavorites(warehouseData.id)}
                      className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Save to Favorites
                    </button>
                  </div>

                  {/* Owner Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                      Listed by: <span className="font-medium text-gray-900">{warehouseData.owner_name}</span>
                    </p>
                    <p className="text-sm text-gray-500 text-center mt-1">
                      {warehouseData.ownership_type} • Member since 2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Warehouses */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Warehouses</h2>
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">No similar warehouses found in this area</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDetails;