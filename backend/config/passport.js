const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

module.exports = function (passport) {
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: '/api/auth/google/callback'
    callbackURL: "https://password-hub-o450.onrender.com/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.googleId = profile.id;
          user.avatar = profile.photos[0].value;
          await user.save();
        } else {
          const encryptionKey = crypto.randomBytes(32).toString('hex');
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0].value,
            encryptionKey
          });
        }
      }

      user.lastLogin = Date.now();
      await user.save();

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));

  // Microsoft Strategy
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    //callbackURL: '/api/auth/microsoft/callback',
    callbackURL: "https://password-hub-o450.onrender.com/api/auth/microsoft/callback",
    scope: ['user.read']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ microsoftId: profile.id });

      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.microsoftId = profile.id;
          await user.save();
        } else {
          const encryptionKey = crypto.randomBytes(32).toString('hex');
          user = await User.create({
            microsoftId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            encryptionKey
          });
        }
      }

      user.lastLogin = Date.now();
      await user.save();

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));

  // GitHub Strategy
  passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //callbackURL: '/api/auth/github/callback'
    callbackURL: "https://password-hub-o450.onrender.com/api/auth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.githubId = profile.id;
          user.avatar = profile.photos[0].value;
          await user.save();
        } else {
          const encryptionKey = crypto.randomBytes(32).toString('hex');
          user = await User.create({
            githubId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0].value,
            encryptionKey
          });
        }
      }

      user.lastLogin = Date.now();
      await user.save();

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
};