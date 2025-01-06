const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  screenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
  movieId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  movieName: { type: String, required: true },
  tmdbId: { type: String, required: true },
  showDate: { type: Date, required: true },
  price: {type: Number, required:true },
  totalSeats: {type: Number, required:true },
  bookedSeats: [{ type: String}],
});

const Show = mongoose.model('Show', showSchema);

module.exports = Show;
