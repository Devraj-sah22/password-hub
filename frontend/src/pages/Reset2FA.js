import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Reset2FA = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const reset2FA = async () => {
      try {

        await axios.post(
          //`http://localhost:5000/api/auth/reset-2fa/${token}`
          //`https://password-hub-o450.onrender.com/api/auth/reset-2fa/${token}`
          `${process.env.REACT_APP_API_URL}/api/auth/reset-2fa/${token}`
        );

        toast.success("2FA reset successfully");

        navigate("/login");

      } catch (error) {

        toast.error("Invalid or expired recovery link");

      } finally {
        setLoading(false);
      }
    };

    reset2FA();

  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-white">

      {loading ? (
        <p>Resetting 2FA...</p>
      ) : (
        <p>Redirecting to login...</p>
      )}

    </div>
  );
};

export default Reset2FA;