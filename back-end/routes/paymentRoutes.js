const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const router = express.Router();
const { validateToken } = require('../middlewares/validateToken');

router.post('/createpaymentintent',  validateToken,createPaymentIntent,);

module.exports = router;
