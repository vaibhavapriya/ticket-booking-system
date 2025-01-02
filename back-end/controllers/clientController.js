const Client = require('../models/clientSchema');
const { cloudinary } = require('../config/cloudinaryConfig');

// Get Client Profile
exports.getClientProfile = async (req, res) => {
    try {
        console.log("hi");
      const  id=req.params.id;
      const client = await Client.findOne({ userid: id });
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.getClientById = async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};

// Update Client Profile
exports.updateClientProfile = async (req, res) => {
  try {
    const { name, city, contactInfo, location, food, parking } = req.body;
    const  id=req.params.id;
    const client = await Client.findOne({ userid: id });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Update fields
    client.name = name || client.name;
    client.city = city || client.city;
    client.contactInfo = contactInfo || client.contactInfo;
    client.location = location || client.location;
    client.food = food !== undefined ? food : client.food;
    client.parking = parking !== undefined ? parking : client.parking;

    // Handle photo uploads
    if (req.files) {
      const photoUploads = req.files.map(async (file) => {
        return file.path; // Multer will provide Cloudinary URLs
      });
      const uploadedPhotos = await Promise.all(photoUploads);
      client.photos.push(...uploadedPhotos);
    }

    await client.save();
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
