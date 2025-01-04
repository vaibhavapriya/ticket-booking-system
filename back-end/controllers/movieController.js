const Cinemahall = require('../models/cinemahallSchema');
const Movie = require('../models/movieSchema')
const Show = require('../models/showSchema')
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

exports.movieShows= async (req, res) => {
  const { tmdbId } = req.params;

  try {
    const movie = await Movie.findOne({ tmdbId }).populate('shows');
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    const cinemahalls = await Cinemahall.find({ 
      userid: { $in: movie.theaters }  // Filter by userId instead of _id
    }).exec();
    console.log(cinemahalls)
    for (let i = 0; i < cinemahalls.length; i++) {
      const cinemahall = cinemahalls[i];
      
      // Step 3a: Populate the shows whose tmdbId matches the movie's tmdbId
      const shows = await Show.find({ 
        tmdbId: movie.tmdbId,
        theaterId: cinemahall.userid// Ensure shows are related to this Cinemahall
      }).exec();
      console.log(shows)

      // Step 3b: Attach the populated shows to the Cinemahall object
      cinemahall.shows = shows;
    }

    // Step 4: Send the movie data with populated Cinemahalls and Shows
    res.json({
      movie: {
        ...movie,
        theaters: cinemahalls  // Attach populated Cinemahalls with shows
      }
    });

  } catch (error) {
    console.error('Error fetching movie details or populating theaters/shows:', error);
    res.status(500).json({ message: 'Error fetching movie details' });
  }

};

