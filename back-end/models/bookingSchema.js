const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookerId :{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
    showId: {type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true,},
    selectedSeats: { type: [String], required: true,
    },
    movieName: { type: String,required: true, },
    theaterName: { type: String, required: true,},
    theaterLocation: { type: String, required: true, },
    screenName: { type: String, required: true,},
    totalPrice: {type: Number, required: true, },
    orderId: {type: String, required: true, },
    bookingDate: {type: Date,default: Date.now, },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;