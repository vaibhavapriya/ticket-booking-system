const Client = require('../models/clientSchema');
const { cloudinary } = require('../config/cloudinaryConfig');

// Get client profile
exports.getClientProfile = async (req, res) => {
  try {
    const  id=req.params.id;
    const client = await Client.findOne({ userid: id });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.updateClientProfile = async (req, res) => {
  try {
    const updates = req.body;
    const id = req.params.id;

    // Find the client by userid
    const client = await Client.findOne({ userid: id });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Update the client
    const updatedClient = await Client.findByIdAndUpdate(client._id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure updates adhere to the schema validation
    }).select('-userid -photos'); // Exclude specific fields

    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }

};

exports.uploadPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.file); // Logs file details (e.g., filename, size, etc.)
    console.log(req.body);
    const client = await Client.findOne({ userid: id });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Check if the photo was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    

    // Store the photo URL in the client's profile
    const photoUrl = req.file.path; 
    console.log(photoUrl)

    // You should update the client profile with the photo URL
    const updatedClient = await Client.findByIdAndUpdate(client._id, {
      $push: { photos: photoUrl }
    }, { new: true });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json({ message: 'Photo uploaded successfully', updatedClient});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};