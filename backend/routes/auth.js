// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../middleware/authMiddleware');
const {
    register,
    login,
    refreshToken
} = require('../controllers/authController');
const googleAuthController = require('../controllers/googleAuthController');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth routes are working!' });
});

// Public auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Google OAuth routes
router.get('/google', googleAuthController.getAuthURL.bind(googleAuthController));
router.get('/google/callback', googleAuthController.handleCallback.bind(googleAuthController));
router.post('/google/verify', googleAuthController.verifyGoogleToken.bind(googleAuthController));

module.exports = router;