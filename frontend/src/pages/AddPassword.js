import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiKey,
  FiUser,
  FiMail,
  FiLink,
  FiFileText,
  FiTag,
  FiStar,
  FiRefreshCw,
  FiCheck,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AddPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    email: '',
    password: '',
    website: '',
    category: 'Other',
    notes: '',
    tags: '',
    favorite: false
  });
  const [generating, setGenerating] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const categories = ['Social', 'Work', 'Personal', 'Finance', 'Other'];

  const generatePassword = async () => {
    setGenerating(true);
    try {
      //const response = await axios.get('http://localhost:5000/api/passwords/generate', {
      const response = await axios.get('/api/passwords/generate', {
        params: {
          length: 16,
          numbers: true,
          symbols: true,
          uppercase: true,
          lowercase: true
        }
      });
      setFormData({ ...formData, password: response.data.password });
      checkPasswordStrength(response.data.password);
    } catch (error) {
      toast.error('Failed to generate password');
    } finally {
      setGenerating(false);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength('Weak');
    else if (strength <= 4) setPasswordStrength('Medium');
    else setPasswordStrength('Strong');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const passwordData = {
        ...formData,
        strength: passwordStrength,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      //await axios.post('http://localhost:5000/api/passwords', passwordData);
      await axios.post('/api/passwords', passwordData);
      toast.success('Password added successfully!');
      navigate('/passwords');
    } catch (error) {
      toast.error('Failed to add password');
    }
  };

  const strengthColors = {
    Weak: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Strong: 'bg-green-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Add New Password</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="e.g., Gmail, Facebook, Work Email"
                />
              </div>
            </div>

            {/* Username and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-24 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 font-mono"
                  placeholder="Enter or generate password"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  disabled={generating}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <FiRefreshCw className={generating ? 'animate-spin' : ''} />
                  Generate
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthColors[passwordStrength] || 'bg-gray-600'}`}
                        style={{
                          width: passwordStrength === 'Weak' ? '33%' :
                            passwordStrength === 'Medium' ? '66%' :
                              passwordStrength === 'Strong' ? '100%' : '0%'
                        }}
                      />
                    </div>
                    <span className={`text-sm ${passwordStrength === 'Weak' ? 'text-red-400' :
                      passwordStrength === 'Medium' ? 'text-yellow-400' :
                        passwordStrength === 'Strong' ? 'text-green-400' : ''
                      }`}>
                      {passwordStrength}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website URL
              </label>
              <div className="relative">
                <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <div className="relative">
                <FiFileText className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (comma separated)
              </label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="work, personal, important"
                />
              </div>
            </div>

            {/* Favorite */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="favorite"
                id="favorite"
                checked={formData.favorite}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              <label htmlFor="favorite" className="text-gray-300">
                Mark as favorite
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all transform hover:scale-105"
              >
                <FiCheck />
                Save Password
              </button>
              <button
                type="button"
                onClick={() => navigate('/passwords')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all"
              >
                <FiX />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddPassword;