/*
 * ./src/index.js - This is the application entry point
 *
 * (C) 2023 Tan Tran Quoc <contact.tantranquoc@gmail.com>
 *
 * This code is licensed under MIT.
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// API routing configuration method
const route = require('./routes/index');

// Database configuration
const db = require('./config/database');

// Instance of Express
const app = express();

// Routing, go into ./routes/index.js for next processing
route(app);

// Connect to database (MongoDB)
db.connect();

// View engine setup (use Handlebars)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

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
