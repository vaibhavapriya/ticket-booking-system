const express = require("express");
const router = express.Router();
const Screen = require('../models/screen'); // Import the model

// Save seat layout
router.post("/saveLayout", async (req, res) => {
  const { screenName, totalSeats, rows, theaterId } = req.body;

  if (!screenName || !theaterId || !rows) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Simulate saving to the database
  const savedData =  new Screen({
    theater :theaterId,
    screenName,
    totalSeats,
    rows,
  });
  await savedData.save();

  console.log("Saved Data:", savedData);

  // Respond back with success
  res.status(200).json({ message: "Layout saved successfully", data: savedData });
});

// Get all layouts
router.get("/layouts", async (req, res) => {
  try {
    const layouts = await Screen.find();
    res.status(200).json(layouts);
  } catch (error) {
    console.error("Error fetching layouts:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
