const express = require("express");
const router = express.Router();
const Booking = require('../models/bookingSchema')


router.post('/', async (req, res) => {
    const { showId, selectedSeats, movieName, theaterName, theaterLocation, screenName, totalPrice, orderId } = req.body;
  
    // Create a booking record in the database
    const newBooking = new Booking({
      showId,
      selectedSeats,
      movieName,
      theaterName,
      theaterLocation,
      screenName,
      totalPrice,
      orderId,
    });
  
    await newBooking.save();
  
    res.status(201).send({ message: 'Booking created successfully' });
  });
  
  module.exports = router;