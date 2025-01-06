const express = require("express");
const router = express.Router();
const Booking = require('../models/bookingSchema')
const Show = require('../models/showSchema')


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
        // Push the selected seats into the bookedSeats array of the corresponding show
        const updatedShow = await Show.findByIdAndUpdate(
          showId,
          { $push: { bookedSeats: { $each: selectedSeats } } },
          { new: true }
        );
    
        if (!updatedShow) {
          return res.status(404).send({ message: 'Show not found' });
        }
    
  
    res.status(201).send({ message: 'Booking created successfully' });
  });
  
  module.exports = router;