// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// register form
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// handle register
router.post('/register', async (req, res) => {
  const { displayName, email, password } = req.body;

  // very basic validation – you can improve this
  if (!email || !password) {
    return res.render('auth/register', { error: 'Email and password are required.' });
  }

  const hash = await bcrypt.hash(password, 10);
  await User.create({ displayName, email, passwordHash: hash });

  res.redirect('/auth/login');
});

// login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// handle local login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/meals/dashboard',
    failureRedirect: '/auth/login'
  })
);

// GitHub login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/meals/dashboard');
  }
);

// Google login (additional feature)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/meals/dashboard');
  }
);

// logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
