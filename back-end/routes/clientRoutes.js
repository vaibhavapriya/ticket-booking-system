const express = require('express');
const { getClientProfile, updateClientProfile } = require('../controllers/clientController');
const { validateToken } = require('../middlewares/validateToken');
const router = express.Router();

router.get('/:id', getClientProfile); // Get client profile
router.put('/:id', validateToken, updateClientProfile); // Update client profile

module.exports = router;
