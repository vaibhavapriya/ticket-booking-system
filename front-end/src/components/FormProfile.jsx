import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormProfile = ({setProfileModal}) => {
  const  clientId=localStorage.getItem('userid')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    address: '',
    contactInfo: '',
    food: false,
    parking: false,
    handicapFacility: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cinemahall/${clientId}`);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching client data');
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`http://localhost:5000/api/cinemahall/${clientId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully');
      setFormData(res.data);
      setProfileModal(false)
    } catch (err) {
      setError('Error updating profile');
    }
  };
  const handleCancel=()=>{
    setProfileModal(false);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-[rgb(255,255,255)]min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold text-[#db0a5b] mb-6">
          Update Profile
        </h2>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#db0a5b]"
            placeholder="Enter your name"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#db0a5b]"
            placeholder="Enter your email"
          />
        </div>

        {/* City Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            City:
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#db0a5b]"
            placeholder="Enter your city"
          />
        </div>

        {/* Address Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Address:
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#db0a5b]"
            placeholder="Enter your address"
          />
        </div>

        {/* Contact Info Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Contact Info:
          </label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#db0a5b]"
            placeholder="Enter your contact info"
          />
        </div>

        {/* Checkbox Fields */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="food"
            checked={formData.food}
            onChange={handleChange}
            className="mr-2 focus:ring-[#db0a5b]"
          />
          <label className="text-gray-700">Food</label>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="parking"
            checked={formData.parking}
            onChange={handleChange}
            className="mr-2 focus:ring-[#db0a5b]"
          />
          <label className="text-gray-700">Parking</label>
        </div>
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            name="handicapFacility"
            checked={formData.handicapFacility}
            onChange={handleChange}
            className="mr-2 focus:ring-[#db0a5b]"
          />
          <label className="text-gray-700">Handicap Facility</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className=" bg-[#db0a5b] text-white p-3 rounded font-bold hover:bg-[#f62459] transition"
        >
          Update Profile
        </button>
        <button onClick={handleCancel}
          className="bg-[#db0a5b] text-white p-3 rounded font-bold hover:bg-[#f62459] transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default FormProfile;
