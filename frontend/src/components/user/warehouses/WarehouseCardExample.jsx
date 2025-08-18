import React from 'react';
import WarehouseCard from './WarehouseCard';

// Example usage component showing how to use WarehouseCard
const WarehouseCardExample = () => {
  // Sample warehouse data based on the database schema
  const sampleWarehouses = [
    {
      id: 'warehouse-1',
      name: 'Prime Industrial Storage Facility',
      approval_status: 'approved',
      images: ['warehouse1.jpg', 'warehouse1_2.jpg'],
      views: 145,
      warehouse_type: 'Standard or General Storage',
      city: 'Mumbai',
      state: 'Maharashtra',
      build_up_area: 10000,
      total_plot_area: 15000,
      listing_for: 'Rent',
      rent: 50000,
      deposit: 150000,
      ownership_type: 'Owner',
      address: '123 Industrial Area, MIDC Phase 1',
      pin_code: 400001,
      plot_status: 'Industrial',
      electricity_kva: 250,
    },
    {
      id: 'warehouse-2',
      name: 'Climate Controlled Warehouse',
      approval_status: 'pending',
      images: ['warehouse2.jpg'],
      views: 87,
      warehouse_type: 'Climate Controlled Storage',
      city: 'Pune',
      state: 'Maharashtra',
      build_up_area: 7500,
      total_plot_area: 10000,
      listing_for: 'Sale',
      price: 2500000,
      ownership_type: 'Broker',
      address: '456 Tech Park, Hinjewadi',
      pin_code: 411057,
      plot_status: 'Commercial',
      electricity_kva: 150,
    },
    {
      id: 'warehouse-3',
      name: 'Chemical Storage Facility',
      approval_status: 'rejected',
      images: [],
      views: 23,
      warehouse_type: 'Hazardous Chemicals Storage',
      city: 'Chennai',
      state: 'Tamil Nadu',
      build_up_area: 5000,
      total_plot_area: 8000,
      listing_for: 'Rent',
      rent: 75000,
      deposit: 225000,
      ownership_type: 'Owner',
      address: '789 Chemical Zone, Manali',
      pin_code: 600068,
      plot_status: 'Industrial',
      electricity_kva: 300,
    }
  ];

  // Example handlers
  const handleEdit = (warehouse) => {
    alert(`Editing warehouse: ${warehouse.name}`);
  };

  const handleDelete = (warehouseId) => {
    alert(`Warehouse ${warehouseId} deleted successfully`);
  };

  const handleView = (warehouse) => {
    alert(`Viewing details for: ${warehouse.name}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Warehouse Card Examples</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Owner View (with CRUD actions)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleWarehouses.map((warehouse) => (
            <WarehouseCard
              key={warehouse.id}
              warehouse={warehouse}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              showActions={true}
              isOwner={true}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Public View (no actions)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleWarehouses.map((warehouse) => (
            <WarehouseCard
              key={`public-${warehouse.id}`}
              warehouse={warehouse}
              onView={handleView}
              showActions={false}
              isOwner={false}
            />
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          WarehouseCard Component Features
        </h3>
        <ul className="list-disc list-inside text-blue-800 space-y-2">
          <li><strong>Image Display:</strong> Shows warehouse images with fallback for missing images</li>
          <li><strong>Status Badges:</strong> Visual indicators for pending/approved/rejected status</li>
          <li><strong>CRUD Actions:</strong> Edit and delete buttons for warehouse owners</li>
          <li><strong>Delete Confirmation:</strong> Modal dialog to confirm deletion</li>
          <li><strong>PropTypes Validation:</strong> Type checking for all props</li>
          <li><strong>Error Handling:</strong> Graceful handling of image loading errors</li>
          <li><strong>Responsive Design:</strong> Works on desktop and mobile devices</li>
          <li><strong>Interactive Elements:</strong> Hover effects and smooth transitions</li>
          <li><strong>Analytics:</strong> View count display</li>
          <li><strong>Currency Formatting:</strong> Proper Indian Rupee formatting</li>
        </ul>
      </div>
    </div>
  );
};

export default WarehouseCardExample;