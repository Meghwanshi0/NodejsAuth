const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const customMware = require('../config/middleware');

const User = require('../models/users'); // Importing the User model

// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email', // Using email as the username field
        passReqToCallback: true
    },
    async function(req,email, password, done){
        try {
            // find a user and establish the identity
            const user = await User.findOne({email: email});
            if(!user){
                req.flash('error', 'User Not Found!!');
                return done(null, false);
            }

            if(user.password !== password){
                req.flash('error','Invalid Username/Password');
                return done(null, false); // No user or incorrect password
            }

            // if (!user || user.password !== password){
            //     req.flash('error', 'Invalid Username/Password');
            //     return done(null, false); // No user or incorrect password
            // }

            return done(null, user); // Authentication successful
        } catch (err) {
             req.flash('error', err);
            return done(err); // Error during authentication
        }
    }
));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id); // Storing user ID in the session
});



// deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done){
    try {
        let user = await User.findById(id);
        return done(null, user);
    } catch(err) {
        console.log('Error in finding user --> Passport', err);
        return done(err);
    }
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;