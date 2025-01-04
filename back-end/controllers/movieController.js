const Cinemahall = require('../models/cinemahallSchema');
const Movie = require('../models/movieSchema')
const { cloudinary } = require('../config/cloudinaryConfig');
 

exports.movieDetails = async (req, res) => {
    const { tmdbId } = req.params;

    try {
      const movie = await Movie.findOne({ tmdbId }).populate('shows');
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(movie);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }

};
