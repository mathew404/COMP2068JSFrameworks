const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  
  if (req.user) {
    return res.redirect('/meals/dashboard');
  } else {
    return res.redirect('/auth/login');
  }
});

module.exports = router;
