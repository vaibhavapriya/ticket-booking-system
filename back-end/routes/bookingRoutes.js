const express = require("express");
const router = express.Router();
const Booking = require('../models/bookingSchema')
const Show = require('../models/showSchema')


router.post('/', async (req, res) => {
  const { showId, selectedSeats, movieName, theaterName, theaterLocation, screenName, totalPrice, orderId } = req.body;

  try {
      // Fetch the show from the database
      const show = await Show.findById(showId);
      if (!show) {
          console.log(`Show with ID ${showId} not found.`);
          return res.status(404).send({ message: 'Show not found' });
      }

      // Check if any of the selected seats are already booked
      const unavailableSeats = selectedSeats.filter(seat => show.bookedSeats.includes(seat));
      if (unavailableSeats.length > 0) {
          console.log(`The following seats are already booked: ${unavailableSeats.join(', ')}`);
          return res.status(400).send({
              message: `The following seats are already booked: ${unavailableSeats.join(', ')}`,
          });
      }

      // Create a new booking record
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

      // Save the booking record to the database
      await newBooking.save();
      console.log(`Booking created successfully for order ID ${orderId}`);

      // Push the selected seats into the bookedSeats array of the corresponding show
      const updatedShow = await Show.findByIdAndUpdate(
          showId,
          { $push: { bookedSeats: { $each: selectedSeats } } },
          { new: true }
      );
  
      if (!updatedShow) {
          console.log(`Show update failed for ID ${showId}`);
          return res.status(404).send({ message: 'Show not found' });
      }

      console.log(`Seats ${selectedSeats.join(', ')} are now marked as booked in the show ${movieName}`);

      // Respond with success
      res.status(201).send({ message: 'Booking created successfully' });
  } catch (error) {
      console.error('Error during the booking process:', error);
      res.status(500).send({ message: 'An error occurred during the booking process' });
  }
});

module.exports = router;
