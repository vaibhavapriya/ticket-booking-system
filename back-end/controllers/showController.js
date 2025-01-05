const Show = require("../models/showSchema"); // Mongoose model
const Screen = require("../models/screenSchema")

// Fetch all schedules
exports.getSchedules = async (req, res) => {
  try {
    const { theaterID } = req.params;
    const schedules = await Show.find({theaterId:theaterID}).populate("screenId");
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedSchedule = await Show.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json(updatedSchedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};