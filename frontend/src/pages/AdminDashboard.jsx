import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalWarehouses: 0,
    pendingWarehouses: 0,
    approvedWarehouses: 0,
    rejectedWarehouses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/admin/stats/dashboard');
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage warehouse approvals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Approvals</h3>
            <p className="text-3xl font-bold text-orange-600 mb-2">{stats.pendingWarehouses}</p>
            <p className="text-gray-600 text-sm">Warehouses awaiting review</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">{stats.approvedWarehouses}</p>
            <p className="text-gray-600 text-sm">Active warehouse listings</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Warehouses</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">{stats.totalWarehouses}</p>
            <p className="text-gray-600 text-sm">All warehouse submissions</p>
          </div>

        </div>


        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/warehouses/pending"
              className="inline-flex items-center justify-center bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors text-center whitespace-nowrap"
            >
              Review Pending Warehouses
            </Link>
            <Link
              to="/admin/warehouses"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors text-center whitespace-nowrap"
            >
              All Warehouses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;