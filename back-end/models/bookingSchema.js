const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  movieName: {
    type: String,
  },
  theaterName: {
    type: String,
  },
  theaterLocation: {
    type: String,
  },
  screenName: {
    type: String,
  },
  selectedSeats: {
    type: [String], 
  },
  totalPrice: {
    type: Number,
  },
  paymentID: {
    type: String, // PayPal payment ID or payment confirmation ID
    required: true,
  },
  paymentStatus: {
    type: String, // Payment status e.g., 'COMPLETED'
    default: 'PENDING',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
