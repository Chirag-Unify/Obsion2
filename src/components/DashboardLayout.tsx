import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Notes', path: '/notes', icon: '📝' },
    { name: 'Todos', path: '/todos', icon: '✓' },
    { name: 'Calendar', path: '/calendar', icon: '📅' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className={`text-xl font-bold text-gray-900 dark:text-white ${!isSidebarOpen && 'hidden'}`}>
            Obsion
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out`}
              >
                <span className="mr-3">{item.icon}</span>
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {user?.name?.[0] || user?.email[0]}
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || user?.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 