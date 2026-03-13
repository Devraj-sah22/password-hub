import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FiKey,
  FiShield,
  FiDownload,
  FiUpload,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiStar,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { FaChartPie } from 'react-icons/fa';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    weak: 0,
    medium: 0,
    strong: 0,
    categories: {}
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [showPasswords, setShowPasswords] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPasswords();

    const handleFocus = () => {
      fetchPasswords();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const fetchPasswords = async () => {
    try {
      //const response = await axios.get('http://localhost:5000/api/passwords');
      const response = await axios.get('/api/passwords');
      setPasswords(response.data);
      calculateStats(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch passwords');
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      weak: data.filter(p => p.strength === 'Weak').length,
      medium: data.filter(p => p.strength === 'Medium').length,
      strong: data.filter(p => p.strength === 'Strong').length,
      categories: {}
    };

    data.forEach(p => {
      stats.categories[p.category] = (stats.categories[p.category] || 0) + 1;
    });

    setStats(stats);
  };

  const handleExport = async () => {
    try {
      //const response = await axios.get('http://localhost:5000/api/passwords/export/excel', {
      const response = await axios.get('/api/passwords/export/excel', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'passwords.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Passwords exported successfully!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      //await axios.post('http://localhost:5000/api/passwords/import/excel', formData, {
      await axios.post('/api/passwords/import/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Passwords imported successfully!');
      fetchPasswords();
    } catch (error) {
      toast.error('Import failed');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const strengthColors = {
    Weak: 'text-red-400',
    Medium: 'text-yellow-400',
    Strong: 'text-green-400'
  };

  const chartData = {
    labels: ['Weak', 'Medium', 'Strong'],
    datasets: [{
      data: [stats.weak, stats.medium, stats.strong],
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
      borderColor: ['#b91c1c', '#b45309', '#047857'],
      borderWidth: 2
    }]
  };

  const categoryData = {
    labels: Object.keys(stats.categories),
    datasets: [{
      data: Object.values(stats.categories),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
      borderWidth: 2
    }]
  };
  //⭐ ADD THIS RIGHT HERE
  const recentPasswords = [...passwords]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <FiDownload />
              Export
            </button>
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                <FiUpload />
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Passwords</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <FiKey className="text-3xl text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Strong Passwords</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.strong}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <FiShield className="text-3xl text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Weak Passwords</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.weak}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <FiAlertCircle className="text-3xl text-red-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Categories</p>
                <p className="text-3xl font-bold text-white mt-2">{Object.keys(stats.categories).length}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <FaChartPie className="text-3xl text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Password Strength Distribution</h3>
            <div className="h-64">
              <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#fff' } } } }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Categories Distribution</h3>
            <div className="h-64">
              <Doughnut data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#fff' } } } }} />
            </div>
          </motion.div>
        </div>

        {/* Recent Passwords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Passwords</h3>
            <Link to="/passwords" className="text-blue-400 hover:text-blue-300 transition-colors">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {/* {passwords.slice(0, 5).map((password) => ( */}
            {/* {passwords
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((password) => ( */}
            {recentPasswords.map((password) => (
              <div
                key={password._id}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {password.favicon ? (
                    <img src={password.favicon} alt="" className="w-8 h-8 rounded" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                      <FiLock className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-medium">{password.title}</h4>
                    <p className="text-sm text-gray-400">{password.username || password.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">

                  <span className="text-white font-mono text-sm">
                    {showPasswords[password._id] ? password.decryptedPassword : "••••••••"}
                  </span>

                  {password.favorite && <FiStar className="text-yellow-400" />}

                  <span className={`text-sm ${strengthColors[password.strength]}`}>
                    {password.strength}
                  </span>

                  <button
                    onClick={() => togglePasswordVisibility(password._id)}
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {showPasswords[password._id]
                      ? <FiEyeOff className="text-gray-400" />
                      : <FiEye className="text-gray-400" />}
                  </button>

                  <CopyToClipboard
                    text={password.decryptedPassword}
                    onCopy={() => toast.success('Password copied to clipboard!')}
                  >
                    <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                      <FiCopy className="text-gray-400" />
                    </button>
                  </CopyToClipboard>

                </div>
              </div>
            ))}

            {passwords.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No passwords yet</p>
                <Link
                  to="/add-password"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <FiKey />
                  Add Your First Password
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;