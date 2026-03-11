import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      toast.success("Password reset email sent");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-8 rounded-xl w-full max-w-md"
      >

        <h2 className="text-2xl font-bold text-white mb-6">
          Forgot Password
        </h2>

        <p className="text-gray-400 mb-6">
          Enter your email and we will send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 bg-gray-700 text-white rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <div className="mt-4 text-sm text-gray-400">

          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Login
          </Link>

        </div>

      </motion.div>

    </div>
  );
};

export default ForgotPassword;