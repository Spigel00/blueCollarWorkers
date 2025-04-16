import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployerProfileForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    address: "",
    contact_number: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/users/employer/profile",
        {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          address: formData.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/employer/dashboard");
    } catch (error) {
      console.error("Error submitting employer profile:", error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Employer Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "company", "address", "contact_number", "email"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        ))}
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default EmployerProfileForm;
