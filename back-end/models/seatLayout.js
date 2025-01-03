const mongoose = require("mongoose");

const seatLayoutSchema = new mongoose.Schema({
  theaterName: { type: String, required: true }, // Name of the theater
  rows: [
    {
      rowLabel: { type: String, required: true },
      seats: [{ type: String }], // Array of seat identifiers, or `null` for gaps
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const seatLayout = mongoose.model("SeatLayout", seatLayoutSchema);

module.exports = SeatLayout;
