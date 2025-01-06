const stripe = require('../config/stripeConfig')

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert amount to smallest currency unit
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

app.post('/api/bookings', async (req, res) => {
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

app.put('/api/shows/updateSeats', async (req, res) => {
  const { showId, reservedSeats } = req.body;

  // Find the show and update the reservedSeats
  const show = await Show.findById(showId);
  if (show) {
    show.reservedSeats.push(...reservedSeats);
    await show.save();
    res.send({ message: 'Seats updated successfully' });
  } else {
    res.status(404).send({ error: 'Show not found' });
  }
});
