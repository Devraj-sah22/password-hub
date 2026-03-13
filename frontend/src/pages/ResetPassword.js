import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      await axios.post(
        //`http://localhost:5000/api/auth/reset-password/${token}`,
        `https://password-hub-o450.onrender.com/api/auth/reset-password/${token}`,
        { password }
      );

      toast.success("Password reset successful");

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Password reset failed"
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
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-3 bg-gray-700 text-white rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>

      </motion.div>

    </div>

  );
};

export default ResetPassword;