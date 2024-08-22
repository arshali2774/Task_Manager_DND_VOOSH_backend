const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
// Using passport-google-oauth20 for Google authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? 'https://task-manager-dnd-voosh-backend.onrender.com/api/auth/google/callback'
          : '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, name, emails } = profile;
      try {
        let user = await User.findOne({ googleId: id });
        if (user) {
          return done(null, user);
        }
        // generate a random string for password since password is required
        let randomString = Math.random().toString(36).substring(2);
        const newUser = new User({
          firstName: name.givenName,
          lastName: name.familyName,
          email: emails[0].value,
          password: randomString,
          googleId: id,
        });
        await newUser.save();

        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
