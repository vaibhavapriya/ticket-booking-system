const mongoose = require("mongoose");

const seatLayoutSchema = new mongoose.Schema({
  screenName: { type: String, required: true }, // Name of the theater
  rows: [
    {
      rowLabel: { type: String,  },
      seats: [{ type: String }], // Array of seat identifiers, or `null` for gaps
    },
  ],
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinemahall',  },
});

const seatLayout = mongoose.model("SeatLayout", seatLayoutSchema);

module.exports = seatLayout;
