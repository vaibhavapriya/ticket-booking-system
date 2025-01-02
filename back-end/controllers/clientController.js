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
