import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import axios from 'axios';
import { getCroppedImg } from '../utils/cropImageUtils'; // Utility function to get the cropped image

const FormPhoto = () => {
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
      console.error('No cropped image available');
      return;
    }

    // Convert the cropped image from base64 to a File object
    const file = base64ToFile(croppedImage, 'cropped-image.jpg');

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post(`http://localhost:5000/api/client/upload/${clientId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }); // API call to upload cropped image
      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h2>Upload and Crop Photo</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {imageUrl && (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}  // Set aspect ratio to 4:3 (landscape orientation)
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedAreaPercentage, croppedAreaPixels) => {
              setCroppedArea(croppedAreaPixels); // Store cropped area coordinates
            }}
          />
        </div>
      )}

      <button onClick={getCroppedImageHandler}>Get Cropped Image</button>

      {croppedImage && (
        <div>
          <h3>Preview Cropped Image:</h3>
          <img src={croppedImage} alt="Cropped preview" />
        </div>
      )}

      <button onClick={handleUpload}>Upload Cropped Image</button>
    </div>
  );
};

export default FormPhoto;
