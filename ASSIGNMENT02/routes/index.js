const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');

// Home (splash)
router.get('/', function (req, res) {
  res.render('home');
});

// public read-only list of all meals
router.get('/meals', async (req, res) => {
  const meals = await Meal.find().sort({ createdAt: -1 }).lean();
  res.render('public-meals', { meals });
});

module.exports = router;
