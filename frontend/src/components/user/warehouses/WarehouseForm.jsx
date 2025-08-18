import React, { useState } from 'react';
import { UploadIcon, XIcon, SaveIcon, ArrowLeftIcon } from 'lucide-react';

const WarehouseForm = ({ warehouse, onSubmit, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: warehouse?.name || '',
    mobile_number: warehouse?.mobile_number || '',
    email: warehouse?.email || '',
    ownership_type: warehouse?.ownership_type || 'Owner',
    address: warehouse?.address || '',
    city: warehouse?.city || '',
    state: warehouse?.state || '',
    pin_code: warehouse?.pin_code || '',
    warehouse_type: warehouse?.warehouse_type || 'Standard or General Storage',
    build_up_area: warehouse?.build_up_area || '',
    total_plot_area: warehouse?.total_plot_area || '',
    total_parking_area: warehouse?.total_parking_area || '',
    plot_status: warehouse?.plot_status || 'Commercial',
    listing_for: warehouse?.listing_for || 'Rent',
    plinth_height: warehouse?.plinth_height || '',
    dock_doors: warehouse?.dock_doors || '',
    electricity_kva: warehouse?.electricity_kva || '',
    rent: warehouse?.rent || '',
    deposit: warehouse?.deposit || '',
    description: warehouse?.description || '',
    comments: warehouse?.comments || ''
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile_number.trim()) newErrors.mobile_number = 'Mobile number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pin_code) newErrors.pin_code = 'PIN code is required';
    if (!formData.build_up_area) newErrors.build_up_area = 'Built-up area is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        images: images.map(img => img.file)
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Warehouse' : 'Add New Warehouse'}
            </h1>
            <p className="text-gray-600 mt-1">
              {mode === 'edit' ? 'Update your warehouse details' : 'Fill in the details to list your warehouse'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warehouse Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter warehouse name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ownership Type *
                  </label>
                  <select
                    name="ownership_type"
                    value={formData.ownership_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Broker">Broker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mobile_number ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter mobile number"
                  />
                  {errors.mobile_number && <p className="text-red-500 text-sm mt-1">{errors.mobile_number}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter city"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter state"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="number"
                      name="pin_code"
                      value={formData.pin_code}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.pin_code ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter PIN code"
                    />
                    {errors.pin_code && <p className="text-red-500 text-sm mt-1">{errors.pin_code}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Warehouse Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warehouse Type *
                  </label>
                  <select
                    name="warehouse_type"
                    value={formData.warehouse_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Standard or General Storage">Standard or General Storage</option>
                    <option value="Hazardous Chemicals Storage">Hazardous Chemicals Storage</option>
                    <option value="Climate Controlled Storage">Climate Controlled Storage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Listing For *
                  </label>
                  <select
                    name="listing_for"
                    value={formData.listing_for}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Built-up Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    name="build_up_area"
                    value={formData.build_up_area}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.build_up_area ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter built-up area"
                  />
                  {errors.build_up_area && <p className="text-red-500 text-sm mt-1">{errors.build_up_area}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Plot Area (sq ft)
                  </label>
                  <input
                    type="number"
                    name="total_plot_area"
                    value={formData.total_plot_area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter total plot area"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent (₹)
                  </label>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter monthly rent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter security deposit"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Upload warehouse images (Max 5 images, 5MB each)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Choose Images
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your warehouse, features, and amenities"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Comments
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional information or special requirements"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <SaveIcon className="w-4 h-4" />
              {mode === 'edit' ? 'Update Warehouse' : 'Create Warehouse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WarehouseForm;