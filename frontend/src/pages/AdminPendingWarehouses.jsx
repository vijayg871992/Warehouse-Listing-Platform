import React from 'react';
import { useNavigate } from 'react-router-dom';
import PendingWarehouses from '../components/admin/warehouses/PendingWarehouses';

const AdminPendingWarehouses = () => {
  const navigate = useNavigate();

  const handleViewDetails = (warehouseId) => {
    navigate(`/admin/warehouses/${warehouseId}`);
  };

  return (
    <div>
      <PendingWarehouses
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default AdminPendingWarehouses;