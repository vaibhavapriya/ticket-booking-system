const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  showTime: { type: Date, required: true },
  screenName: { type: String, required: true },
  seatLayout: [{ type: String }], // Array of seat identifiers
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: "Cinemahall", required: true },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
