// routes/meals.js
const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');

// simple auth guard
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// show logged-in user's meals
router.get('/dashboard', ensureAuth, async (req, res) => {
  const meals = await Meal.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.render('meals/list', { meals });
});

// create form
router.get('/create', ensureAuth, (req, res) => {
  res.render('meals/create');
});

// handle create
router.post('/create', ensureAuth, async (req, res) => {
  await Meal.create({
    name: req.body.name,
    calories: req.body.calories,
    protein: req.body.protein,
    carbs: req.body.carbs,
    fat: req.body.fat,
    notes: req.body.notes,
    user: req.user._id
  });
  res.redirect('/meals/dashboard');
});

// edit form
router.get('/:id/edit', ensureAuth, async (req, res) => {
  const meal = await Meal.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!meal) return res.redirect('/meals/dashboard');
  res.render('meals/edit', { meal });
});

// handle edit
router.post('/:id/edit', ensureAuth, async (req, res) => {
  await Meal.updateOne(
    { _id: req.params.id, user: req.user._id },
    {
      name: req.body.name,
      calories: req.body.calories,
      protein: req.body.protein,
      carbs: req.body.carbs,
      fat: req.body.fat,
      notes: req.body.notes
    }
  );
  res.redirect('/meals/dashboard');
});

// delete confirm
router.get('/:id/delete', ensureAuth, async (req, res) => {
  const meal = await Meal.findOne({ _id: req.params.id, user: req.user._id }).lean();
  if (!meal) return res.redirect('/meals/dashboard');
  res.render('meals/delete-confirm', { meal });
});

// handle delete
router.post('/:id/delete', ensureAuth, async (req, res) => {
  await Meal.deleteOne({ _id: req.params.id, user: req.user._id });
  res.redirect('/meals/dashboard');
});

module.exports = router;
