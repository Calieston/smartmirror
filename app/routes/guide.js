'use strict';

var express = require('express');
var router = express.Router();

/* GET guide page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SmartMirror Setup Guide' });
});

module.exports = router;
