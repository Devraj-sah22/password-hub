import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FiKey,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiStar,
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiFilter,
  FiLock,
  FiUnlock,
  FiPlus
} from 'react-icons/fi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';

const Passwords = () => {
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPasswords, setShowPasswords] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Social', 'Work', 'Personal', 'Finance', 'Other'];

  useEffect(() => {
    fetchPasswords();
  }, []);

  useEffect(() => {
    filterPasswords();
  }, [searchTerm, selectedCategory, passwords]);

  const fetchPasswords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/passwords');
      setPasswords(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch passwords');
      setLoading(false);
    }
  };

  const filterPasswords = () => {
    let filtered = passwords;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.website?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPasswords(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this password?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/passwords/${id}`);
      setPasswords(passwords.filter(p => p._id !== id));
      toast.success('Password deleted successfully');
    } catch (error) {
      toast.error('Failed to delete password');
    }
  };

  const handleToggleFavorite = async (id, favorite) => {
    try {
      await axios.put(`http://localhost:5000/api/passwords/${id}`, {
        favorite: !favorite
      });
      setPasswords(passwords.map(p => 
        p._id === id ? { ...p, favorite: !favorite } : p
      ));
      toast.success(favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const strengthColors = {
    Weak: 'text-red-400 bg-red-400/10',
    Medium: 'text-yellow-400 bg-yellow-400/10',
    Strong: 'text-green-400 bg-green-400/10'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Passwords</h1>
          <Link
            to="/add-password"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105"
          >
            <FiPlus />
            Add Password
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Passwords Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPasswords.map((password, index) => (
            <motion.div
              key={password._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {password.favicon ? (
                    <img src={password.favicon} alt="" className="w-10 h-10 rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <FiLock className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-semibold">{password.title}</h3>
                    <p className="text-sm text-gray-400">{password.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleFavorite(password._id, password.favorite)}
                  className={`p-2 rounded-lg transition-colors ${
                    password.favorite ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <FiStar className={password.favorite ? 'fill-current' : ''} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Username/Email</span>
                  <span className="text-white">{password.username || password.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Password</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">
                      {showPasswords[password._id] ? password.decryptedPassword : '••••••••'}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(password._id)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      {showPasswords[password._id] ? 
                        <FiEyeOff className="text-gray-400" /> : 
                        <FiEye className="text-gray-400" />
                      }
                    </button>
                    <CopyToClipboard
                      text={showPasswords[password._id] ? password.decryptedPassword : '***'}
                      onCopy={() => toast.success('Password copied!')}
                    >
                      <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                        <FiCopy className="text-gray-400" />
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
                {password.website && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Website</span>
                    <a
                      href={password.website.startsWith('http') ? password.website : `https://${password.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 truncate max-w-[150px]"
                    >
                      {password.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <span className={`px-2 py-1 rounded-full text-xs ${strengthColors[password.strength]}`}>
                  {password.strength}
                </span>
                <div className="flex gap-2">
                  <Link
                    to={`/edit-password/${password._id}`}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiEdit2 />
                  </Link>
                  <button
                    onClick={() => handleDelete(password._id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPasswords.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FiKey className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No passwords found</p>
              <Link
                to="/add-password"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <FiPlus />
                Add New Password
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Passwords;