const express = require('express');
const { getClientProfile, updateClientProfile, uploadPhoto, addMovie} = require('../controllers/clientController');
const { validateToken } = require('../middlewares/validateToken');
const upload = require('../config/cloudinaryConfig')
const router = express.Router();

router.get('/:id', getClientProfile); // Get client profile
router.put('/:id', validateToken, updateClientProfile); // Update client profile
router.post('/upload/:id', upload.single('photo'), uploadPhoto);
router.post('/movies', addMovie); 


module.exports = router;
