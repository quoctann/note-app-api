/*
 * ./src/index.js
 * This is application entry point, the first thing that Express execute.
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const session = require('express-session');
require('dotenv').config();

// API routing configuration method
const route = require('./routes/index');

// Database configuration
const db = require('./config/database');

// Instance of Express
const app = express();

// View engine setup (use Handlebars)
hbs.registerPartials(
    path.join(__dirname, 'resources', 'views', 'partials'), function(err) { });
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// Connect to database (MongoDB)
db.connect();

// decode or encode session
app.use(session({
  secret: 'Any normal Word',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2*60*1000,
  },
}));

// Create session.SOMETHING global variable for handlebars
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// Routing, go into ./routes/index.js for next processing
route(app);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
