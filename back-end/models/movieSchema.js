const mongoose = require('mongoose');

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: String,
  releaseDate: String,
  overview: String,
  tmdbId: { type: String, unique: true, required: true }, // TMDB ID should be unique
  theaters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cinemahall',  }], // Reference to clients who are adding the movie
  shows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show',  }] 
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
