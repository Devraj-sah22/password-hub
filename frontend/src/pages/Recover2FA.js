import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Recover2FA = () => {

  const [email, setEmail] = useState("");

  const handleRecover = async () => {
    try {

      await axios.post(
        "http://localhost:5000/api/auth/recover-2fa",
        { email }
      );

      toast.success("Recovery email sent");

    } catch (error) {
      toast.error("Recovery failed");
    }
  };

  return (
    <div className="p-10 text-white">

      <h1 className="text-2xl mb-4">
        Recover 2FA
      </h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="p-2 bg-gray-800"
      />

      <button
        onClick={handleRecover}
        className="ml-3 px-4 py-2 bg-blue-500 rounded"
      >
        Send Recovery Email
      </button>

    </div>
  );
};

export default Recover2FA;