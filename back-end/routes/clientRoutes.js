const express = require('express');
const CinemaHall = require('../models/cinemahallSchema')
const { getClientProfile, updateClientProfile, uploadPhoto, addMovie} = require('../controllers/clientController');
const { validateToken } = require('../middlewares/validateToken');
const upload = require('../config/cloudinaryConfig')
const router = express.Router();

router.get('/:id', getClientProfile); // Get client profile
router.put('/:id', validateToken, updateClientProfile); // Update client profile
router.post('/upload/:id', upload.single('photo'), uploadPhoto);
router.post('/movie/:id', addMovie);
router.get("/", async (req, res) => {
    try {
      const cinemas = await CinemaHall.find({});
      res.status(200).json(cinemas);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }); 




module.exports = router;
  // router.get('/:userId', async (req, res) => {
  //   try {
  //     const { userId } = req.params;
      
  //     // Find the theater by userId (theaterId)
  //     const theater = await Theater.findOne({ userId }) // Assuming userId corresponds to the theaterId field
  //       .populate('shows') // You can populate the shows or any other relevant data
  //       .populate('otherRelatedField'); // Add any other related fields if needed
      
  //     if (!theater) {
  //       return res.status(404).json({ message: 'Theater not found' });
  //     }
  
  //     // Send the populated theater data as response
  //     res.json(theater);
  //   } catch (error) {
  //     console.error('Error fetching theater:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // });
  