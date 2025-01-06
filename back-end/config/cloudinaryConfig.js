const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name
    format: async (req, file) => {
      const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
      const ext = file.originalname.split('.').pop();
      if (!supportedFormats.includes(ext)) {
        throw new Error('Unsupported file format');
      }
      return ext; // Ensure supported formats
    },
    public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
    transformation: [      { 
      width: 1600, 
      height: 680, 
      crop: 'fill', 
      gravity: 'center', 
      aspect_ratio: 1600 / 680 // Optional: Enforce aspect ratio as 1600x680
    }],
  },
});

const upload = multer({ storage });
module.exports = upload;
