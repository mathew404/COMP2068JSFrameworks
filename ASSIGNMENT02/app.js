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

// ---------- Database + Passport setup ----------
const connectDB = require('./config/db');
connectDB(); // connect to MongoDB

require('./config/passport')(); // register all passport strategies

// ---------- Routers ----------
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const mealsRouter = require('./routes/meals');

const app = express();

// ---------- View engine ----------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// ---------- Core middleware ----------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// security + performance helpers
app.use(helmet());
app.use(compression());

// static files (CSS, images, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Sessions + Passport ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'devSecretChangeMe',
    resave: false,
    saveUninitialized: false,
    cookie: {
      // on Render (production, HTTPS) cookies are secure
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// make user + year available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.year = new Date().getFullYear();
  next();
});

// ---------- Routes ----------
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/meals', mealsRouter);

// ---------- 404 handler ----------
app.use((req, res, next) => {
  next(createError(404));
});

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;