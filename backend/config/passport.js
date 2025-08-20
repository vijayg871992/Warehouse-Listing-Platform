const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../models');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists with Google ID
    let user = await User.findOne({ 
      where: { googleId: profile.id }
    });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({ 
      where: { email: profile.emails[0].value }
    });

    if (user) {
      // Update existing user with Google ID
      user.googleId = profile.id;
      await user.save();
      return done(null, user);
    }

    // Create new user
    const names = profile.displayName.split(' ');
    user = await User.create({
      googleId: profile.id,
      firstName: names[0] || profile.displayName,
      lastName: names.slice(1).join(' ') || '',
      email: profile.emails[0].value
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;