const express = require("express");
const Movie = require("../models/movieSchema");
const Show = require('../models/showSchema');
const Screen = require('../models/screenSchema');
const Cinemahall = require("../models/cinemahallSchema");
const { movieDetails, movieShows } = require("../controllers/movieController")
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
    const { theaterId ,screenId, movieName, tmdbId, movieId, showDate, price,  totalSeats} = req.body;
    console.log(req.body)

    if (!movieName || !theaterId || !screenId || totalSeats === 0) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newShow = new Show({
      theaterId ,screenId, movieName, tmdbId, movieId, showDate, price,  totalSeats
    });

    const savedShow = await newShow.save();

    const theater = Cinemahall.findOne({userid:theaterId})

    await Cinemahall.findByIdAndUpdate(theater._id, { $push: { shows: savedShow._id } });
    await Movie.findByIdAndUpdate(movieId, { $push: { shows: savedShow._id } });
    await Screen.findByIdAndUpdate(screenId, { $push: { shows: savedShow._id } });

    res.status(201).json({ message: "Show scheduled successfully!" });
  } catch (error) {
    console.error("Error scheduling show:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/details/:tmdbId',movieDetails)
router.get('/shows/:tmdbId',movieShows)

module.exports = router;


