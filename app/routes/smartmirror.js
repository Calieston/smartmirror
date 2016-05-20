'use strict';
var express = require('express');
var router = express.Router();
var jade = require('jade');
// Var weatherController = require('../controllers/weather');

var smartmirrorController = require('./../controllers/smartmirror');

var path = require('path');

/* GET smartmirror interface page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'SmartMirror Interface' });
  /*Res.sendFile(path.resolve('public/index.html'));*/
});

/*Router.route('/weather')
  .get(weatherController.getWeather)
  .post(weatherController.getWeather);
*/

router.get('/:id', (req, res, next) => {

  smartmirrorController.get(req.params.id).then((user) => {
    res.render('smartmirror', {
      user: user,
      templateRender: jade.renderFile
    });
  });
});

module.exports = router;
