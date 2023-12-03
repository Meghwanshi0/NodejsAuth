const express = require('express');
const app = express();
const port = 8002;
const expressLayouts = require('express-ejs-layouts');
const db =require('./config/mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

app.use(expressLayouts);
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'NodejsAuthentication',
    secret: 'iDontKnow',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());    
app.use(passport.setAuthenticatedUser); 

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
});