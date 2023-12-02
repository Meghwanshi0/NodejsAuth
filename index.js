const express = require('express');
const app = express();
const port = 8002;
const expressLayouts = require('express-ejs-layouts');
const db =require('./config/mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(expressLayouts);
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
});