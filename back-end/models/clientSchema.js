const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  food: { type: Boolean },
  parking: { type: Boolean },
  rating: { type: Number, min: 0, max: 5 },
  email: { type: String, required: true, unique: true },
  city: { type: String },
  contactInfo: { type: String },
  photos: [{ type: String }], // Cloudinary URLs
});

module.exports = mongoose.model('Client', clientSchema);
