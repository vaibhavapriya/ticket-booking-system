const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage with Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'resumes',  // Folder in Cloudinary
//     format: 'pdf',  // Explicitly set the format to PDF
//     resource_type: 'raw',
//     public_id: (req, file) => Date.now() + '-' + file.originalname.replace('.pdf', ''),  // Remove .pdf from the original file name to prevent duplication
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder in Cloudinary for the uploaded files
    format: async (req, file) => {
      const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
      const ext = file.originalname.split('.').pop();
      if (!supportedFormats.includes(ext)) {
        throw new Error('Unsupported file format');
      }
      return ext;
    },
    public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`, // Remove extension from the name
    transformation: [{ crop: 'landscape' }], // Crop images to landscape
  },
});


// Create Multer instance
const upload = multer({ storage });

module.exports = upload;

