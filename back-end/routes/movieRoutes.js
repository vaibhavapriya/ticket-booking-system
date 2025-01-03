const express = require("express");
const Movie = require("../models/movieSchema");
const Schedule = require("../models/sheduleSchema");
const router = express.Router();

// Fetch all movies
router.get("/all", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Schedule a show
router.post("/scheduleShow/:id", async (req, res) => {
  try {
    const { movieName, showTime, screenName, seatLayout } = req.body;

    if (!movieName || !showTime || !screenName || seatLayout.length === 0) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newShow = new ShowSchedule({
      movieName,
      showTime,
      screenName,
      seatLayout,
    });

    await newShow.save();
    res.status(201).json({ message: "Show scheduled successfully!" });
  } catch (error) {
    console.error("Error scheduling show:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
