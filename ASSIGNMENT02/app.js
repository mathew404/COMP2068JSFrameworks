// app.js

// ----- Load handlebars + environment variables -----
const hbs = require('hbs');
require('dotenv').config();

// ----- Core dependencies -----
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const passport = require('passport');

// ----- Database connection -----
const connectDB = require('./config/db');
connectDB();

// ----- Passport strategies -----
require('./config/passport')();

// ----- Routers -----
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const mealsRouter = require('./routes/meals');

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// register partials folder: views/partials/*.hbs
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// security + performance
app.use(helmet());
app.use(compression());

// serve static files from /public (css, images, client-side js)
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'devSecretChangeMe',
    resave: false,
    saveUninitialized: false,
    cookie: {
    
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// make current user + year available in all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.year = new Date().getFullYear();
  next();
});



// '/' is handled by indexRouter (routes/index.js)
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/meals', mealsRouter);

// optional healthcheck route (Render logs, uptime checks, etc.)
app.get('/health', (req, res) => {
  res.send('ok');
});


app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {
  // set locals, only providing error details in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;