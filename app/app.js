'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// MongoDB setup
mongoose.connect('mongodb://localhost/smartmirror');

mongoose.connection.on('error',
  console.error.bind(console, 'connection error:')
);
mongoose.connection.once('open', function() {
  console.log('MongoDB connected');
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.static(__dirname + '../bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// App.use(express.static(path.join(__dirname, 'bower_components')));

// Routes
var guide = require('./routes/guide');
var backend = require('./routes/index');
var smartmirror = require('./routes/smartmirror');

// External:
// Backend
app.use('/', backend);
// Initial setup guide
app.use('/guide', guide);

// Mirror
// Mirror Interface
app.use('/smartmirror', smartmirror);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error(404);
  res.status(404);
  res.render('error.jade', {
    message: '404: File Not Found',
    err: req.url,
  });
});

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Production error handler
// No stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;
