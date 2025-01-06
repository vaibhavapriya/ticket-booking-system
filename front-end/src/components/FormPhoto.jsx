import React, { useState } from 'react';
import axios from 'axios';

const FormPhoto = ({ setPhotoModal }) => {
  const clientId = localStorage.getItem('userid');
  const [image, setImage] = useState(''); // Image in Base64 format

  const handleCancle = () => {
    setPhotoModal(false);
  };

  // Handle file upload and convert to Base64
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('No file selected');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      if (base64String && base64String.startsWith('data:image')) {
        setImage(base64String);
      } else {
        alert('Invalid image format. Please upload a valid image file.');
      }
    };
    reader.onerror = () => {
      alert('Failed to read the file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please upload an image before uploading.');
      return;
    }

    // Convert the base64 image directly to a File object
    const file = base64ToFile(image, `image-${Date.now()}.jpg`); // Adding timestamp to avoid overwriting

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post(
        `https://ticket-booking-system-7vpl.onrender.com/api/cinemahall/upload/${clientId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      ); // API call to upload image

      console.log('Image uploaded successfully:', response.data);
      setPhotoModal(false); // Close the modal or reset states
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again later.');
    }
  };

  // Function to convert base64 to File object
  const base64ToFile = (base64String, fileName) => {
    const byteString = atob(base64String.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const file = new File([ab], fileName, { type: 'image/jpeg' });
    return file;
  };

  return (
    <div className="p-6 bg-lightGray min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-darkGray mb-6">Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer mb-6"
      />

      {image && (
        <div className="mt-6">
          <h3 className="text-lg text-darkGray mb-4">Image Preview:</h3>
          <img src={image} alt="Preview" className="max-w-full rounded-lg shadow-lg" />
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <button
          onClick={handleUpload}
          className="bg-[#db0a5b] text-white p-2 rounded font-bold hover:bg-[#f62459] transition flex-1"
        >
          Upload Image
        </button>
        <button
          onClick={handleCancle}
          className="bg-gray-400 text-white p-2 rounded font-bold hover:bg-gray-500 transition flex-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FormPhoto;
