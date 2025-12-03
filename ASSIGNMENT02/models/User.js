// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  displayName: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },   // for local auth
  githubId: { type: String },       // for GitHub OAuth
  googleId: { type: String },       // for Google OAuth (additional feature)
  createdAt: { type: Date, default: Date.now }
});

// validate password for local login
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
