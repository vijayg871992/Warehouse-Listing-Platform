import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Import pages and components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthSuccess from './pages/AuthSuccess';
import TestPage from './pages/TestPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminWarehouses from './pages/AdminWarehouses';
import AdminPendingWarehouses from './pages/AdminPendingWarehouses';
import WarehousesPage from './pages/WarehousesPage';
import PublicWarehousesPage from './pages/PublicWarehousesPage';
import WarehouseDetailsPage from './pages/WarehouseDetailsPage';
import NewWarehousePage from './pages/NewWarehousePage';

// Import layouts
import UserLayout from './layouts/userlayout/UserLayout';
import AdminLayout from './layouts/adminlayout/AdminLayout';

// Import route guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.PROD ? '/warehouse-listing' : '/'}>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/warehouses" element={<PublicWarehousesPage />} />
            <Route path="/warehouse/:id" element={<WarehouseDetailsPage />} />
            
            {/* User Protected Routes */}
            <Route path="/user" element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="warehouses" element={<WarehousesPage />} />
              <Route path="warehouses/new" element={<NewWarehousePage />} />
              <Route path="warehouses/:id" element={<WarehouseDetailsPage />} />
              <Route path="browse-public" element={<PublicWarehousesPage />} />
            </Route>
            
            {/* Admin Protected Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="warehouses" element={<AdminWarehouses />} />
              <Route path="warehouses/pending" element={<AdminPendingWarehouses />} />
              <Route path="warehouses/:id" element={<WarehouseDetailsPage />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
