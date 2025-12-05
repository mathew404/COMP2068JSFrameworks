// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function () {
  // ----- LOCAL STRATEGY (email + password) -----
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, // use "email" field from the form
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });

          if (!user || !user.passwordHash) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          const isMatch = await user.validatePassword(password);
          if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // ----- GITHUB STRATEGY -----
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            user = await User.create({
              githubId: profile.id,
              displayName: profile.username || profile.displayName,
              email:
                profile.emails && profile.emails[0]
                  ? profile.emails[0].value
                  : `${profile.username}@github.local`
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // ----- GOOGLE STRATEGY (ADDITIONAL FEATURE) -----
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              displayName: profile.displayName,
              email:
                profile.emails && profile.emails[0]
                  ? profile.emails[0].value
                  : undefined
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // ----- SERIALIZE / DESERIALIZE -----
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
