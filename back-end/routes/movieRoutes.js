const express = require("express");
const Movie = require("../models/movieSchema");
const Show = require('../models/showSchema');
const Screen = require('../models/screenSchema');
const Cinemahall = require("../models/cinemahallSchema");
const { movieDetails, movieShows } = require("../controllers/movieController")
const mongoose = require('mongoose');
const router = express.Router();
const moment = require('moment'); 

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
    const halls = await Screen.find({theater:theaterId});
    res.json(halls);
  } catch (error) {
    console.error("Error fetching halls:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Schedule a show
router.post("/show", async (req, res) => {
  try {
    const { theaterId, screenId, movieName, tmdbId, movieId, showDate, price, totalSeats } = req.body;
    console.log("Request body:", req.body);

    // Validate required fields
    if (!movieName || !theaterId || !screenId || totalSeats === 0) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Parse the showDate into a moment object for easier comparison
    const showDateMoment = moment(showDate);
    const showEndTime = showDateMoment.clone().add(3, "hours"); // Assuming a 3-hour movie runtime

    // Fetch the screen document with populated shows
    const screen = await Screen.findById(screenId).populate("shows");

    if (!screen) {
      return res.status(404).json({ error: "Screen not found" });
    }

    // Check for overlapping shows
    const overlappingShow = screen.shows.find((existingShow) => {
      const existingShowStart = new Date(existingShow.showDate);
      const existingShowEnd = new Date(existingShow.showDate);
      existingShowEnd.setHours(existingShowEnd.getHours() + 3); // Assume 3-hour movie runtime

      // Overlap logic
      return (
        showDateMoment.toDate() < existingShowEnd &&
        showEndTime.toDate() > existingShowStart
      );
    });

    if (overlappingShow) {
      console.log("Found overlapping show:", overlappingShow.movieName);
      console.log("Overlapping show start time:", new Date(overlappingShow.showDate).toISOString());
      console.log("Overlapping show end time:", new Date(overlappingShow.showDate).setHours(new Date(overlappingShow.showDate).getHours() + 3));
      return res.status(400).json({ error: "Show overlaps with an existing schedule." });
    }

    console.log("No overlapping shows found.");
    console.log("New show start time:", showDateMoment.toDate());
    console.log("New show end time:", showEndTime.toDate());

    // Create the new show
    const newShow = new Show({
      theaterId,
      screenId,
      movieName,
      tmdbId,
      movieId,
      showDate,
      price,
      totalSeats,
    });

    const savedShow = await newShow.save();

    // Update the theater, movie, and screen with the saved show
    const theater = await Cinemahall.findOne({
      userid: new mongoose.Types.ObjectId(theaterId),
    });

    if (theater) {
      await Cinemahall.findByIdAndUpdate(
        theater._id,
        { $push: { shows: savedShow._id } },
        { new: true }
      );
      console.log("Updated Theater:", theater);
    }

    await Movie.findByIdAndUpdate(movieId, { $push: { shows: savedShow._id } }, { new: true });
    console.log("Updated Movie for ID:", movieId);

    await Movie.findByIdAndUpdate(theaterId, { $addToSet: { theaters: theaterId } }, { new: true });
    console.log("Updated Movie for ID:", movieId);

    await Screen.findByIdAndUpdate(screenId, { $push: { shows: savedShow._id } }, { new: true });
    console.log("Updated Screen for ID:", screenId);

    res.status(201).json({ message: "Show scheduled successfully!" });
  } catch (error) {
    console.error("Error scheduling show:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/details/:tmdbId',movieDetails)
router.get('/shows/:tmdbId',movieShows)

module.exports = router;


