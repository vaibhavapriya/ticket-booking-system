const express = require("express");
const Movie = require("../models/movieSchema");
const Show = require('../models/showSchema')
const SeatLayout = require('../models/seatLayout')
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

router.get("/screens/:id", async (req, res) => {
  const theaterId = req.params.id;
  try {
    const halls = await SeatLayout.find({theater:theaterId});
    res.json(halls);
  } catch (error) {
    console.error("Error fetching halls:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Schedule a show
router.post("/show", async (req, res) => {
  try {
    const { theaterId ,screenId, movieName, tmdbId, showDate, price,  totalSeats} = req.body;
    console.log(req.body)

    if (!movieName || !theaterId || !screenId || totalSeats === 0) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newShow = new Show({
      theaterId ,screenId, movieName, tmdbId, showDate, price,  totalSeats
    });

    await newShow.save();
    res.status(201).json({ message: "Show scheduled successfully!" });
  } catch (error) {
    console.error("Error scheduling show:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
