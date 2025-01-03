const express = require("express");
const Schedule = require("../models/schedule"); // Adjust path as necessary
const router = express.Router();

router.post("/api/scheduleShow", async (req, res) => {
  try {
    const { movieName, showTime, screenName, seatLayout, theaterId } = req.body;

    if (!movieName || !showTime || !screenName || seatLayout.length === 0 || !theaterId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new show schedule
    const newShow = new Schedule({
      movieId,
      movieName,
      showTime,
      screenName,
      seatLayout,
      theaterId,
    });

    // Save the new show schedule
    await newShow.save();

    res.status(201).json({ message: "Show scheduled successfully!" });
  } catch (error) {
    console.error("Error scheduling show:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
