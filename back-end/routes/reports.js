const express = require('express');
const router = express.Router();
const Show = require('../models/showSchema'); // Show model
const Booking = require('../models/bookingSchema'); // Booking model (if exists)

// Endpoint to fetch booking trends
router.get('/booking-trends', async (req, res) => {
  try {
    const trends = await Show.aggregate([
      {
        $group: {
          _id: '$movieName',
          totalRevenue: { $sum: { $multiply: ['$price', { $size: '$bookedSeats' }] } },
          totalBookings: { $sum: { $size: '$bookedSeats' } },
        },
      },
      { $sort: { totalBookings: -1 } }, // Sort by most booked movies
    ]);
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking trends' });
  }
});

// Endpoint to fetch theater occupancy rates
router.get('/theater-occupancy', async (req, res) => {
  try {
    const occupancy = await Show.aggregate([
      {
        $project: {
          theaterId: 1,
          screenId: 1,
          movieName: 1,
          showDate: 1,
          occupancyRate: {
            $multiply: [
              { $divide: [{ $size: '$bookedSeats' }, '$totalSeats'] },
              100,
            ],
          },
        },
      },
      { $sort: { occupancyRate: -1 } }, // Sort by highest occupancy
    ]);
    res.json(occupancy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch theater occupancy rates' });
  }
});

module.exports = router;
