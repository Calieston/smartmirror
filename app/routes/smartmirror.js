'use strict';

var express = require('express');
var router = express.Router();

/* GET smartmirror interface page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SmartMirror Interface' });
});

module.exports = router;
