const express = require("express");
const router = express.Router();
const SeatLayout = require('../models/seatLayout'); // Import the model

// Save seat layout
router.post("/saveLayout", async (req, res) => {
  try {
    const { theaterName, rows } = req.body;

    if (!theaterName || !rows || rows.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    // Save to database
    const layout = new SeatLayout({ theaterName, rows });
    await layout.save();

    res.status(201).json({ message: "Seat layout saved successfully", layout });
  } catch (error) {
    console.error("Error saving seat layout:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all layouts
router.get("/layouts", async (req, res) => {
  try {
    const layouts = await SeatLayout.find();
    res.status(200).json(layouts);
  } catch (error) {
    console.error("Error fetching layouts:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
