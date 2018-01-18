const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const index = require('./routes/index');
const users = require('./routes/users-routes');
const event = require('./routes/event-routes');
const campaign = require('./routes/campaign-routes');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
require('dotenv').config();

const database = require('./config/mongoDB');
require('./config/passport');
console.log("hello World");
const app = express();

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//Middleware///////////////////////////////////////////////////////////////////
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  credentials: true,                   // allow other domains to send cookies
  origin: [ 'http://localhost:4200' ]  // these are the domains that are allowed
}));

//Routes////////////////////////////////////////////////////////////////////////
app.use('/api/user', users);
app.use('/api/campaign', campaign);
app.use('/api/event', event);

app.use((req, res, next) => {
    // If no routes match, send them the Angular HTML.
    res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;
