import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalWarehouses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.warehouses.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h1>
          <p className="text-gray-600">Manage your warehouse listings and view analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Warehouses</h3>
            <p className="text-gray-600 mb-4">View and manage your warehouse listings</p>
            <Link
              to="/user/warehouses"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Warehouses
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Warehouse</h3>
            <p className="text-gray-600 mb-4">List a new warehouse for rent or sale</p>
            <Link
              to="/user/warehouses/new"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Warehouse
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Public</h3>
            <p className="text-gray-600 mb-4">Explore warehouses available for rent</p>
            <Link
              to="/user/browse-public"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Browse Warehouses
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Total Warehouses</span>
                <span className="text-lg font-semibold text-blue-600">
                  {loading ? '...' : stats.totalWarehouses}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;