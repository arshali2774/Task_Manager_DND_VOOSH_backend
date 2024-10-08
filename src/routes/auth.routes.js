const express = require('express');
const { register, login, logout } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
} = require('../validations/auth.validation');
const passport = require('passport');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// sign up route
router.post('/register', validate(registerSchema), register);
// login route
router.post('/login', validate(loginSchema), login);
// logout route
router.get('/logout', logout);
// get user data route
router.get('/user', protect, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json(req.user);
});

// Google OAuth routes (if using Google login)
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    console.log(req.user);
    const token = generateToken(req.user._id);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect based on environment
    if (process.env.NODE_ENV === 'production') {
      res.redirect('https://task-manager-voosh-project.netlify.app/tasks');
    } else {
      res.redirect('http://localhost:5173/tasks');
    }
  }
);

module.exports = router;
