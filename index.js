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
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const mongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const path = require('path');

app.use(expressLayouts);
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

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
    },
    store: mongoStore.create(
        {   
            mongoUrl: 'mongodb://127.0.0.1:27017/NodeJsAuth_development',
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());    
app.use(passport.setAuthenticatedUser); 

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
});