import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { SiMicrosoft } from 'react-icons/si';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) {
          toast.error('Name is required');
          return;
        }
        await register(name, email, password);
      }
    } catch (error) {
      // Error is already handled in auth context
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    //window.location.href = `http://localhost:5000/api/auth/${provider}`;
    //window.location.href = `https://password-hub-o450.onrender.com/api/auth/${provider}`;
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Password Hub
          </h1>
          <p className="text-gray-400 mt-2">Secure. Smart. Simple.</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuthLogin('google')}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthLogin('microsoft')}
              className="w-full flex items-center justify-center gap-3 bg-[#2F2F2F] hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <SiMicrosoft className="text-xl text-blue-500" />
              Continue with Microsoft
            </button>

            <button
              onClick={() => handleOAuthLogin('github')}
              className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2b3137] text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <FiGithub className="text-xl" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </Link>

              <Link
                to="/recover-2fa"
                className="text-blue-400 hover:text-blue-300"
              >
                Lost authenticator?
              </Link>
            </div>
            {/* <div className="text-right">
              <Link
                to="/recover-2fa"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Lost your authenticator?
              </Link>
            </div> */}
            {/* <div className="text-right">
              <a
                href="/recover-2fa"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Lost your authenticator?
              </a>
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;