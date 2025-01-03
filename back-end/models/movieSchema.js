const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbid: {type: String },
  title: { type: String },
  poster: { type: String },
  releaseDate: { type: String },
  overview: { type: String },
  genre: [{ type: String }],
});
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;