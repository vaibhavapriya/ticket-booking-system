const express = require('express');
const { forgotPassword,  resetPassword } = require('../controllers/loginController');
const { login, signup, logout} = require('../controllers/userLoginController');
const { validateResetToken } = require('../middlewares/validateResetToken')


const router = express.Router();

// Public route for login
router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout)

// POST: Send password reset email
router.post('/forgot-password', forgotPassword);

//POST: Reset password (uses validateToken middleware)
router.post('/reset-password/:token', validateResetToken, resetPassword);

module.exports = router;
