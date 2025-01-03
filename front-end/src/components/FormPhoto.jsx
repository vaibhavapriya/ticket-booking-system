import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { getCroppedImg } from '../utils/cropImageUtils'; // Utility function to get the cropped image

const FormPhoto = ({setPhotoModal}) => {
  const clientId = localStorage.getItem('userid');
  const [imageUrl, setImageUrl] = useState(null);  // Store the uploaded image URL
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // Position of the crop area
  const [zoom, setZoom] = useState(1);  // Zoom level for the cropper
  const [croppedArea, setCroppedArea] = useState(null);  // Store cropped area dimensions
  const [croppedImage, setCroppedImage] = useState(null);  // Store the cropped image

  // Handle image upload from file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get the cropped image
  const getCroppedImageHandler = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(imageUrl, croppedArea);
      setCroppedImage(croppedImageUrl);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  // Convert base64 to a file and upload
  const base64ToFile = (base64String, fileName) => {
    const [metadata, base64Data] = base64String.split(',');
    const mime = metadata.match(/:(.*?);/)[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const byteArray = new Array(1024);
      for (let i = 0; i < 1024; i++) {
        byteArray[i] = byteCharacters.charCodeAt(offset + i);
      }
      byteArrays.push(new Uint8Array(byteArray));
    }

    const file = new Blob(byteArrays, { type: mime });
    return new File([file], fileName, { type: mime });
  };

  // Upload cropped image
  const handleUpload = async () => {
    if (!croppedImage) {
        alert('Please crop the photo before uploading');
      return;
    }

    // Convert the cropped image from base64 to a File object
    const file = base64ToFile(croppedImage, 'cropped-image.jpg');

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post(`http://localhost:5000/api/cinemahall/upload/${clientId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }); // API call to upload cropped image
      console.log('Image uploaded successfully:', response.data);
      setPhotoModal(false);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  const handleCancle =()=>{
    setPhotoModal(false);
  }

  return (
    <div className="bg-[#fbe7ef] p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-[#db0a5b] mb-6">Upload and Crop Photo</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-[#db0a5b]"
      />

      {imageUrl && (
        <div className="relative w-full h-[400px] mb-6">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1280 / 720}  // Set aspect ratio to 1280x720 (16:9)
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedAreaPercentage, croppedAreaPixels) => {
              setCroppedArea(croppedAreaPixels); // Store cropped area coordinates
            }}
          />
        </div>
      )}

      <button
        onClick={getCroppedImageHandler}
        className="w-full bg-[#db0a5b] text-white p-3 rounded font-bold hover:bg-[#f62459] transition mb-4"
      >
        Get Cropped Image
      </button>

      {croppedImage && (
        <div className="mb-6">
          <h3 className="text-[#db0a5b] font-semibold">Preview Cropped Image:</h3>
          <img src={croppedImage} alt="Cropped preview" className="w-full h-auto rounded-lg shadow-md" />
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleUpload}
          className="bg-[#db0a5b] text-white p-3 rounded font-bold hover:bg-[#f62459] transition flex-1"
        >
          Upload Cropped Image
        </button>
        <button
          onClick={handleCancle}
          className="bg-gray-400 text-white p-3 rounded font-bold hover:bg-gray-500 transition flex-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FormPhoto;
