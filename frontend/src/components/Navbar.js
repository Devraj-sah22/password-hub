import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiKey,
  FiPlusCircle,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/passwords', icon: FiKey, label: 'Passwords' },
    { path: '/add-password', icon: FiPlusCircle, label: 'Add' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-gray-800/90 backdrop-blur-xl border-t md:border-t-0 md:border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Hidden on mobile */}
          <Link to="/" className="hidden md:flex items-center gap-2">
            <FiKey className="text-2xl text-blue-400" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Password Hub
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center justify-around md:justify-end w-full md:w-auto gap-1 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 md:px-4 py-2"
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-blue-500/20 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`relative z-10 text-xl ${
                    isActive ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                  <span className={`relative z-10 text-xs md:text-sm ${
                    isActive ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* User Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;