const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "413328732bdmsmddsdsdnltdgskmdkvu7lkip.apps.googleusercontent.com",
    clientSecret: "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mO",
    callbackURL: "http://localhost:8002/users/auth/google/callback",
},

async function(accessToken, refreshToken, profile, done){
    try {
        // Find a user
        let user = await User.findOne({ email: profile.emails[0].value });

        // console.log(accessToken, refreshToken); // Log access token and refresh token
        // console.log(profile); // Log the profile data

        if (user) {
            // If found, set this user as req.user
            return done(null, user);
        } else {
            // If not found, create the user and set it as req.user
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });
            return done(null, user);
        }
    } catch (err) {
        console.log('error in google strategy-passport', err);
        return done(err);
    }
}));

module.exports = passport;
