const express = require('express');
const Show = require('../models/showSchema'); // Assuming the Show model is in models/Show.js
const Screen = require('../models/screenSchema'); // Assuming the Screen model is in models/Screen.js
const {
  getSchedules,
  updateSchedule,
} = require("../controllers/showController");

const router = express.Router();

// Route to fetch show information populated with screen data
router.get('/:showId', async (req, res) => {
  try {
    const { showId } = req.params;
    
    // Find the show and populate the screen details
    const show = await Show.findById(showId)
      .populate('screenId') // Populate the screen details
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Send the populated show data as response
    res.json(show);
  } catch (error) {
    console.error('Error fetching show:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all schedules
router.get("/bytheater/:theaterID", getSchedules);

// Update a schedule
router.put("/:id", updateSchedule);



module.exports = router;
