const express = require('express');
const Show = require('../models/showSchema'); // Assuming the Show model is in models/Show.js
const Screen = require('../models/screenSchema'); // Assuming the Screen model is in models/Screen.js
const CinemaHall = require('../models/cinemahallSchema')
const { getSchedules, updateSchedule, } = require("../controllers/showController");
const Cinemahall = require('../models/cinemahallSchema');

const router = express.Router();

// Route to fetch show information populated with screen data
router.get('/:showId', async (req, res) => {
  try {
    const { showId } = req.params;
    
    // Find the show and populate the screen details
    const show = await Show.findById(showId)
      .populate('screenId'); // Populate the screen details
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    console.log()

    // Fetch the associated CinemaHall using the theaterId from the show
    const theater = await CinemaHall.findOne({ userid: show.theaterId });

    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    // Send the populated show data and theater information as response
    res.json({
      show,
      theater
    });
  } catch (error) {
    console.error('Error fetching show:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all schedules
router.get("/bytheater/:theaterID", getSchedules);

// Update a schedule
router.put("/:id", updateSchedule);

router.get('/theater/:theaterID', async (req, res) => {

  try {
    const { theaterID } = req.params; // theaterId is passed as a query parameter
    if (!theaterID) {
      return res.status(400).json({ error: 'theaterId parameter is required' });
    }
    // Find the Cinemahall document based on the provided theaterId (userid)
    const theater = await Cinemahall.findOne({ userid: theaterID });

    const shows = await Show.find({ theaterId: theaterID })
      .populate('movieId')  // Populate movie details
      .sort({ showDate: 1 });  // Sort shows by showDate

    if (!shows.length) {
      return res.status(404).json({ error: 'No shows found for the specified theater' });
    }

    // Group shows by movieName
    const groupedShows = shows.reduce((acc, show) => {
      const movieName = show.movieName;

      if (!acc[movieName]) {
        acc[movieName] = [];
      }

      acc[movieName].push(show);

      return acc;
    }, {});

    res.json({ shows: groupedShows , theater});
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
