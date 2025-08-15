import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout(); // clear auth state
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-white/95 via-blue-50/90 to-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="p-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg shadow-md hover:shadow-lg"
          >
            <Activity className="h-6 w-6 text-white" />
          </motion.div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent tracking-wide">
            MediSense
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                isActive(item.path)
                  ? "text-blue-600 bg-blue-100 rounded-full shadow-sm"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.name}
              {!isActive(item.path) && (
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              )}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.first_name || "User"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="mt-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-blue-600 p-2"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-md rounded-b-lg"
        >
          <div className="px-2 pt-3 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-lg transition ${
                  isActive(item.path)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Welcome, {user.first_name || "User"}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg mt-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  </nav>

  );
};

export default Navbar;
