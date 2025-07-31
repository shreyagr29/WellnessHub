import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';
import { LogOut, Plus, Home, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-primary-600 bg-primary-50'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200" role="navigation" aria-label="main navigation">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌿</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WellnessHub</span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/my-sessions" className={navLinkClass('/my-sessions')}>
                <BookOpen size={18} />
                <span>My Sessions</span>
              </Link>
              <Link
                to="/sessions/new"
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <Plus size={18} />
                <span>New Session</span>
              </Link>
            </div>
          )}

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Welcome, {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
