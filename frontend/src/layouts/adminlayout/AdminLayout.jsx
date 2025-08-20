import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOutIcon, UserIcon, HomeIcon, BuildingIcon, UsersIcon, BarChartIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Pending Approvals', href: '/admin/warehouses/pending', icon: BuildingIcon },
    { name: 'All Warehouses', href: '/admin/warehouses', icon: BuildingIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/admin/dashboard" className="text-xl font-bold text-red-600">
                Admin Panel
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.href
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;