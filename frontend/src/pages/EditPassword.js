/*import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditPassword = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        username: "",
        password: "",
        website: "",
        category: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchPassword();
    }, [id]);

    const fetchPassword = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/passwords/${id}`);

            setFormData({
                title: res.data.title || "",
                username: res.data.username || "",
                password: res.data.decryptedPassword || "",
                website: res.data.website || "",
                category: res.data.category || ""
            });

        } catch (error) {
            toast.error("Failed to load password");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:5000/api/passwords/${id}`, {
                ...formData,
                password: formData.password
            });
            toast.success("Password updated");
            navigate("/passwords");
        } catch (error) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl mb-4">Edit Password</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full p-2 bg-gray-800"
                />

                <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full p-2 bg-gray-800"
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full p-2 bg-gray-800 pr-10"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-gray-400 hover:text-white"
                    >
                        {showPassword ? "🙈" : "👁"}
                    </button>
                </div>
                <input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Website"
                    className="w-full p-2 bg-gray-800"
                />

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800"
                >
                    <option value="">Select Category</option>
                    <option value="Social">Social</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                </select>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="bg-blue-500 px-4 py-2 rounded"
                    >
                        Update Password
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/passwords")}
                        className="bg-gray-600 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPassword;*/