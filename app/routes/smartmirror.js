'use strict';
var express = require('express');
var router = express.Router();
var Widget = require('./../models/widgets');
var weatherController = require('../controllers/weather');
var path = require('path');

/* GET smartmirror interface page. */
router.get('/', (req, res, next) => {
  /*  Res.render('index', { title: 'SmartMirror Interface' });*/
  res.sendFile(path.resolve('public/index.html'));
});

router.route('/weather')
  .get(weatherController.getWeather)
  .post(weatherController.getWeather);


router.get('/:id', (req, res, next) => {
  res.render('index', {title: 'Smartmirror user: ' + req.params.id});
});

module.exports = router;
