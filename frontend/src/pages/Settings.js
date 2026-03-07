import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiUser,
  FiMail,
  FiShield,
  FiBell,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiUpload,
  FiLogOut,
  FiLock,
  FiKey
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const Settings = () => {
  const { user, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    email: user?.email || '',
    name: user?.name || '',
    twoFactor: false,
    emailNotifications: true,
    autoLock: localStorage.getItem("autoLock") || '5',
    theme: 'dark'
  });
  const [qrCode, setQrCode] = useState(null);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFAToken, setTwoFAToken] = useState("");
  // Apply theme change
  const changeTheme = (mode) => {
    setSettings(prev => ({ ...prev, theme: mode }));
    localStorage.setItem("theme", mode);

    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    }
    else if (mode === "light") {
      document.documentElement.classList.remove("dark");
    }
    else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
    else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  /* ADD THIS NEW useEffect BELOW */
  useEffect(() => {

    const fetchUserProfile = async () => {
      try {

        const res = await axios.get("http://localhost:5000/api/users/profile");

        setSettings(prev => ({
          ...prev,
          email: res.data.email,
          name: res.data.name,
          twoFactor: res.data.twoFactorEnabled
        }));

      } catch (error) {
        console.error("Failed to load profile");
      }
    };

    fetchUserProfile();

  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Here you would typically save settings to backend
    toast.success('Settings saved successfully!');
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/passwords/export/excel', {
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
  const handleImport = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:5000/api/passwords/import/excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Passwords imported successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Import failed");
    }
  };
  const enable2FA = async () => {
    try {

      const res = await axios.post("http://localhost:5000/api/users/2fa/enable");

      setQrCode(res.data.qr);
      setShow2FASetup(true);

      toast.success("Scan QR code using Google Authenticator");

    } catch (error) {
      toast.error("Failed to enable 2FA");
    }
  };
  const verify2FA = async () => {
    try {

      await axios.post("http://localhost:5000/api/users/2fa/verify", {
        token: twoFAToken
      });

      toast.success("2FA enabled successfully");

      setShow2FASetup(false);
      // ADD THIS
      setSettings(prev => ({
        ...prev,
        twoFactor: true
      }));

    } catch (error) {
      toast.error("Invalid verification code");
    }
  };

  // ADD THIS FUNCTION RIGHT HERE
  const disable2FA = async () => {
    try {

      await axios.post("http://localhost:5000/api/users/2fa/disable");

      setSettings(prev => ({
        ...prev,
        twoFactor: false
      }));

      toast.success("2FA disabled successfully");

    } catch (error) {
      toast.error("Failed to disable 2FA");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-300 dark:border-gray-700"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

          {/* Profile Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiUser className="text-blue-400" />
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiShield className="text-green-400" />
              Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiLock className="text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-400">Add an extra layer of security</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="twoFactor"
                    checked={settings.twoFactor}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      //handleChange(e);

                      if (checked && !settings.twoFactor) {
                        enable2FA();
                      }

                      if (!checked && settings.twoFactor) {
                        disable2FA();
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {show2FASetup && (
                <div className="p-4 bg-gray-700/30 rounded-lg mt-4">

                  <p className="text-white mb-3">
                    Scan this QR Code using Google Authenticator
                  </p>

                  <img src={qrCode} alt="2FA QR" className="w-40 mb-4" />

                  <input
                    type="text"
                    placeholder="Enter 6 digit code"
                    value={twoFAToken}
                    onChange={(e) => setTwoFAToken(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />

                  <button
                    onClick={verify2FA}
                    className="ml-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    Verify
                  </button>

                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiKey className="text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Master Password</p>
                    <p className="text-sm text-gray-400">Last changed 30 days ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Change
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto-Lock (minutes)
                </label>
                <select
                  name="autoLock"
                  value={settings.autoLock}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange(e);
                    localStorage.setItem("autoLock", value);
                    window.dispatchEvent(new Event("mousemove"));
                  }}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="1">1 minute</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiBell className="text-yellow-400" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive security alerts via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
            <div className="flex gap-4">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <FiDownload />
                Export Data
              </button>
              <label className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors cursor-pointer">
                <FiUpload />
                Import Data
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Theme Preference */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
            <div className="flex gap-4">
              <button
                onClick={() => changeTheme('dark')}
                className={`px-6 py-3 rounded-lg transition-colors ${settings.theme === 'dark'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                Dark
              </button>
              <button
                onClick={() => changeTheme('light')}
                className={`px-6 py-3 rounded-lg transition-colors ${settings.theme === 'light'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                Light
              </button>
              <button
                onClick={() => changeTheme('system')}
                className={`px-6 py-3 rounded-lg transition-colors ${settings.theme === 'system'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                System
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-lg transition-colors"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;