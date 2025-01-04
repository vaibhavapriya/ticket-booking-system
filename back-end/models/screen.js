const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  screenName: { type: String, required: true }, // Name of the theater
  rows: [
    {
      rowLabel: { type: String,  },
      seats: [{ type: String }], // Array of seat identifiers, or `null` for gaps
    },
  ],
  totalSeats: { type: Number },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinemahall',  },
  shows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show',  }] 
});

const screen = mongoose.model("Screen", screenSchema);

module.exports = screen;
