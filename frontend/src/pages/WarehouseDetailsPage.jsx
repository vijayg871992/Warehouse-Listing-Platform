import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, MapPinIcon, PhoneIcon, MailIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

const WarehouseDetailsPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageUrl = (images, index = 0) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return 'https://vijayg.dev/warehouse-listing/uploads/default.jpg';
    }
    
    const image = images[index];
    if (!image) return 'https://vijayg.dev/warehouse-listing/uploads/default.jpg';
    
    // The API now returns full URLs, so return them as-is
    return image;
  };

  useEffect(() => {
    fetchWarehouse();
  }, [id]);

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      let response;
      
      if (location.pathname.includes('/admin/')) {
        response = await apiService.admin.getWarehouseById(id);
      } else {
        response = await apiService.public.getWarehouseById(id);
      }
      
      if (response.data.success) {
        setWarehouse(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching warehouse:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Determine back link based on current path and user role
  const getBackLink = () => {
    if (location.pathname.includes('/admin/')) {
      return '/admin/warehouses';
    } else {
      return '/warehouses';
    }
  };

  const getBackText = () => {
    if (location.pathname.includes('/admin/')) {
      return 'Back to Admin Warehouses';
    } else {
      return 'Back to Warehouses';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading warehouse details...</p>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Warehouse not found</h3>
          <p className="text-gray-600 mb-4">The warehouse you're looking for doesn't exist.</p>
          <Link
            to={getBackLink()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {getBackText()}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navbar for public view */}
      {!location.pathname.includes('/admin/') && !location.pathname.includes('/user/') && (
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
                {user ? (
                  <>
                    <Link to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="text-gray-600 hover:text-gray-900 transition-colors">
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { logout(); navigate('/'); }} 
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to={getBackLink()}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {getBackText()}
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery Slider */}
          <div className="h-64 md:h-96 bg-gray-200 relative">
            {warehouse.images && warehouse.images.length > 0 ? (
              <>
                <img 
                  src={getImageUrl(warehouse.images, currentImageIndex)} 
                  alt={`${warehouse.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain bg-gray-100"
                  onError={(e) => {
                    // Fallback to the default warehouse image on the server
                    e.target.src = 'https://vijayg.dev/warehouse-listing/uploads/default.jpg';
                  }}
                />
                {warehouse.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? warehouse.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === warehouse.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {warehouse.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">No images available</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Details */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {warehouse.name}
                </h1>
                
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{warehouse.city}, {warehouse.state} - {warehouse.pin_code}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Built-up Area</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {warehouse.build_up_area ? warehouse.build_up_area.toLocaleString() : 'N/A'} sq ft
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Area</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {warehouse.total_plot_area ? warehouse.total_plot_area.toLocaleString() : 'N/A'} sq ft
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="text-lg font-semibold text-gray-900">{warehouse.warehouse_type || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Listing For</p>
                    <p className="text-lg font-semibold text-gray-900">{warehouse.listing_for || 'N/A'}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {warehouse.address || 'Address not available'}
                  </p>
                </div>

                {warehouse.description && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                    <p className="text-gray-600 leading-relaxed">
                      {warehouse.description}
                    </p>
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {warehouse.plinth_height && (
                      <div><span className="font-medium">Plinth Height:</span> {warehouse.plinth_height} ft</div>
                    )}
                    {warehouse.dock_doors && (
                      <div><span className="font-medium">Dock Doors:</span> {warehouse.dock_doors}</div>
                    )}
                    {warehouse.electricity_kva && (
                      <div><span className="font-medium">Electricity:</span> {warehouse.electricity_kva} KVA</div>
                    )}
                    {warehouse.plot_status && (
                      <div><span className="font-medium">Plot Status:</span> {warehouse.plot_status}</div>
                    )}
                    {warehouse.total_parking_area && (
                      <div><span className="font-medium">Parking Area:</span> {warehouse.total_parking_area} sq ft</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact & Pricing Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  {warehouse.listing_for === 'Rent' && (
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        ₹{warehouse.rent ? warehouse.rent.toLocaleString() : 'Contact for Price'} / month
                      </h3>
                      {warehouse.deposit && (
                        <p className="text-gray-600">Security Deposit: ₹{warehouse.deposit.toLocaleString()}</p>
                      )}
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Owner</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">{warehouse.mobile_number || 'Contact for details'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MailIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">
                          {warehouse.owner?.email || warehouse.email || 'Contact for details'}
                        </span>
                      </div>
                    </div>
                  </div>


                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                      Listed by: <span className="font-medium text-gray-900">
                        {warehouse.ownership_type || (warehouse.owner ? `${warehouse.owner.firstName} ${warehouse.owner.lastName}` : 'Owner')}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 text-center mt-1">
                      Member since 2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WarehouseDetailsPage;