// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User'); // Adjust path to your User model÷
import User from '../models/User.js'; // Adjust path to your User model
import dotenv from 'dotenv';
dotenv.config();


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL, // Must match the one in Google Console
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in your DB
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // If user exists, continue
        return done(null, user);
      } else {
        // If user doesn't exist, create a new one
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          // You can add a placeholder or leave password empty
        });
        await newUser.save();
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, false);
    }
  }
));
