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
