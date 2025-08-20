import React from 'react';
import { useNavigate } from 'react-router-dom';
import WarehouseForm from '../components/user/warehouses/WarehouseForm';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const NewWarehousePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'images' && Array.isArray(formData[key])) {
          // Handle image files
          formData[key].forEach((image, index) => {
            if (image && image instanceof File) {
              submitData.append('images', image);
            }
          });
        } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      const response = await apiService.warehouses.create(submitData);
      
      if (response.data.success) {
        toast.success('Warehouse submitted for approval successfully!');
        navigate('/user/warehouses');
      } else {
        toast.error('Failed to create warehouse');
      }
    } catch (error) {
      console.error('Error creating warehouse:', error);
      toast.error(error.response?.data?.message || 'Failed to create warehouse');
    }
  };

  const handleCancel = () => {
    navigate('/user/warehouses');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Warehouse</h1>
          <p className="text-gray-600">Fill in the details to list your warehouse</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <WarehouseForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default NewWarehousePage;