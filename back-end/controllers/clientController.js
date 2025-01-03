const Cinemahall = require('../models/cinemahallSchema');
const Movie = require('../models/movieSchema')
const { cloudinary } = require('../config/cloudinaryConfig');

// Get client profile
exports.getClientProfile = async (req, res) => {
  try {
    const  id=req.params.id;
    console.log(id)
    const cinemahall = await Cinemahall.findOne({ userid: id });
    if (!cinemahall) {
      return res.status(404).json({ error: 'Cinemahall not found' });
    }
    res.status(200).json(cinemahall);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.updateClientProfile = async (req, res) => {
  try {
    const updates = req.body;
    const id = req.params.id;

    // Find the client by userid
    const cinemahall = await Cinemahall.findOne({ userid: id });
    if (!cinemahall) {
      return res.status(404).json({ error: 'Cinemahall not found' });
    }

    // Update the client
    const updatedClient = await Cinemahall.findByIdAndUpdate(cinemahall._id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure updates adhere to the schema validation
    }).select('-userid -photos'); // Exclude specific fields

    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }

};

exports.uploadPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.file); // Logs file details (e.g., filename, size, etc.)
    console.log(req.body);
    const cinemahall = await Cinemahall.findOne({ userid: id });
    if (!cinemahall) {
      return res.status(404).json({ error: 'Cinemahall not found' });
    }

    // Check if the photo was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }
    

    // Store the photo URL in the client's profile
    const photoUrl = req.file.path; 
    console.log(photoUrl)

    // You should update the client profile with the photo URL
    const updatedClient = await Cinemahall.findByIdAndUpdate(cinemahall._id, {
      $push: { photos: photoUrl }
    }, { new: true });

    if (!cinemahall) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json({ message: 'Photo uploaded successfully', updatedClient});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.addMovie =  async (req, res) => {
  try {
    const { title, poster, releaseDate, overview, tmdbId } = req.body;
    const id = req.params.id;

    // Find the client by userid
    const cinemahall = await Cinemahall.findOne({ userid: id });tmdbId
    if (!cinemahall) {
      return res.status(404).json({ error: 'Cinemahall not found' });
    }

    console.log(tmdbId)

    // Check if the movie with the same TMDB ID already exists
    const existingMovie = await Movie.findOne({ tmdbId: tmdbId });

    if (existingMovie) {
      // If the movie already exists, update the theaters array to include the new clientId
      if (!existingMovie.theaters.includes(id)) {
        existingMovie.theaters.push(id);
        await existingMovie.save();
        return res.status(200).json({ message: 'Movie updated with new theater' });
      } else {
        return res.status(200).json({ message: 'Movie already added by this theater' });
      }
    }

    // If movie does not exist, create a new movie
    const newMovie = new Movie({
      title,
      poster,
      releaseDate,
      overview,
      tmdbId,// Add companyId as the theater posting the movie
      theaters: [id], // Add the first theater (client)
    });

    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully' });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Server error' });
  }
};