const express = require("express");
const router = express.Router();
const Booking = require('../models/bookingSchema');
const Show = require('../models/showSchema');
const { validateToken } = require('../middlewares/validateToken');
const nodemailer = require('nodemailer');  // Import Nodemailer
const twilio = require('twilio');  // Import Twilio

const sendBookingConfirmationEmail = async (email, bookingDetails) => {
  try {
    // Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const message = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Booking Confirmation: ${bookingDetails.movieName}`,
      text: `
        Hello,

        Your booking for the movie "${bookingDetails.movieName}" has been confirmed!

        Show Date: ${bookingDetails.showtime}
        Seats: ${bookingDetails.selectedSeats.join(', ')}
        Total Price: ₹${bookingDetails.totalPrice}

        Thank you for booking with us! If you have any questions, feel free to reach out.

        Regards,
        Your Theater Name
      `,
    };

    // Send email
    await transporter.sendMail(message);
    console.log('Booking confirmation email sent!');
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
  }
};
const sendBookingConfirmationSMS = async (phoneNumber, bookingDetails) => {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const message = await client.messages.create({
      body: `Your booking for "${bookingDetails.movieName}" is confirmed! Showtime: ${bookingDetails.showtime}. Seats: ${bookingDetails.selectedSeats.join(', ')}. Total: ₹${bookingDetails.totalPrice}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber, // Ensure the phone number is in E.164 format, e.g., +12361234567
    });

    console.log('Booking confirmation SMS sent!');
  } catch (error) {
    console.error('Error sending booking confirmation SMS:', error);
  }
};

router.get('/', validateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ bookerId: req.user.id });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});
router.post('/', validateToken, async (req, res) => {
  console.log(req.user);
  const bookerId = req.user.id;
  console.log(bookerId);

  const { showId, selectedSeats, movieName, theaterName, theaterLocation, screenName, totalPrice, orderId, email, phoneNumber } = req.body;

  try {
    // Fetch the show from the database to get showtime
    const show = await Show.findById(showId);
    if (!show) {
      console.log(`Show with ID ${showId} not found.`);
      return res.status(404).send({ message: 'Show not found' });
    }

    const showtime = show.showDate; // Extract showtime from the show document

    // Check if any of the selected seats are already booked
    const uniqueSelectedSeats = [...new Set(selectedSeats)];
    const uniqueBookedSeats = [...new Set(show.bookedSeats)];
    
    const unavailableSeats = uniqueSelectedSeats.filter(seat => uniqueBookedSeats.includes(seat));
    
    if (unavailableSeats.length > 0) {
      console.log(`The following seats are already booked: ${unavailableSeats.join(', ')}`);
      return res.status(400).send({
        message: `The following seats are already booked: ${unavailableSeats.join(', ')}`,
      });
    }

    // Create a new booking record
    const newBooking = new Booking({
      bookerId,
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

    // Send confirmation email and SMS
    await sendBookingConfirmationEmail(email, {
      movieName,
      selectedSeats,
      showtime,  // Correctly pass the showtime here
      totalPrice,
    });
    await sendBookingConfirmationSMS(phoneNumber, {
      movieName,
      selectedSeats,
      showtime,  // Correctly pass the showtime here
      totalPrice,
    });

    // Respond with success
    res.status(201).send({ message: 'Booking created successfully', bookingId: newBooking._id });
  } catch (error) {
    console.error('Error during the booking process:', error);  // Log the actual error
    res.status(500).send({ message: 'An error occurred during the booking process', error: error.message });  // Include the error message in the response
  }
});
router.post('/cancel', validateToken, async (req, res) => {
  const { bookingId } = req.body;

  try {
    // Find the booking to cancel
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged-in user
    if (booking.bookerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if the booking is within 3 hours of showtime
    const showTime = new Date(booking.showTime);
    const cancelTimeLimit = showTime - Date.now();
    if (cancelTimeLimit <= 3 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'No refund available if canceled within 3 hours of the showtime' });
    }

    // Update booking status to 'canceled'
    booking.status = 'canceled';
    await booking.save();

    // Remove booked seats from the show
    const show = await Show.findById(booking.showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    show.bookedSeats = show.bookedSeats.filter(seat => !booking.selectedSeats.includes(seat));
    await show.save();

    res.json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: 'Error canceling booking' });
  }
});


module.exports = router;
