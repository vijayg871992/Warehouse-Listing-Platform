import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Warehouse Listing Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find and list warehouses with ease. Connect warehouse owners with businesses looking for storage solutions.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;