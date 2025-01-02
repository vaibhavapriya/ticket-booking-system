const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  city: { type: String },
  address: { type: String },
  contactInfo: { type: String },
  food: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  handicapFacility: { type: Boolean, default: false },
  photos: [{ type: String }],
  rating: { type: Number, default: 0 }, // Added rating field
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

