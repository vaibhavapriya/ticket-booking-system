import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const FormProfile = () => {
  const [profile, setProfile] = useState({});
  const [photos, setPhotos] = useState([]);
  const [cropper, setCropper] = useState(null);
  const userId = localStorage.getItem('userid');  

  useEffect(() => {
    // Fetch profile data
    axios.get(`http://localhost:5000/api/client/${userId}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handleCrop = () => {
    if (cropper  && cropper.getCroppedCanvas()) {
      const croppedImage = cropper.getCroppedCanvas().toBlob((blob) => {
        const croppedFile = new File([blob], 'cropped-photo.jpg', { type: 'image/jpeg' });
        setPhotos((prev) => [...prev, croppedFile]);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token =localStorage.getItem('token');
    const formData = new FormData();
    for (const key in profile) {
      formData.append(key, profile[key]);
    }
    photos.forEach((photo) => formData.append('photos', photo));
  
    try {
      const res = await axios.put(`http://localhost:5000/api/client/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' ,
             Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully');
      setProfile(res.data);
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={profile.name || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">City</label>
        <input
          type="text"
          name="city"
          value={profile.city || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Contact Info</label>
        <input
          type="text"
          name="contactInfo"
          value={profile.contactInfo || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Photos</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full px-4 py-2 border rounded-md"
        />
        <Cropper
          style={{ height: 200, width: '100%' }}
          aspectRatio={16 / 9}
          onInitialized={(instance) => setCropper(instance)}
        />
        <button type="button" onClick={handleCrop} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">
          Crop Photo
        </button>
      </div>
      <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-md">
        Save Profile
      </button>
    </form>
  );
};

export default FormProfile;
