const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const router = express.Router();

router.post('/createpaymentintent', createPaymentIntent);

module.exports = router;
