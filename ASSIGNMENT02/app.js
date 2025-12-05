// app.js
const hbs = require('hbs');

require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const session = require('express-session');
const passport = require('passport');

// connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// init passport strategies
require('./config/passport')();

// routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const mealsRouter = require('./routes/meals');

const app = express();

// -------------------- view engine setup --------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));


// -------------------- middleware --------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// security + performance
app.use(helmet());
app.use(compression());

// static files (css, images, client js)
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- session + passport --------------------
// Using default memory store is fine for this assignment.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'devSecretChangeMe',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// make user available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.year = new Date().getFullYear();
  next();
});

// -------------------- routes --------------------
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/meals', mealsRouter);

// -------------------- 404 handler --------------------
app.use(function (req, res, next) {
  next(createError(404));
});

// -------------------- error handler --------------------
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
