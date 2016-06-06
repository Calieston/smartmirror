'use strict';
var express = require('express');
var router = express.Router();
var jade = require('jade');
var path = require('path');
var fs = require('fs');
// Var weatherController = require('../controllers/weather');

var smartmirrorController = require('./../controllers/smartmirror');

/* GET smartmirror interface page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'SmartMirror Interface' });
});

router.route('/:userId')
  .get((req, res) => {
    smartmirrorController.getUser(req.params.userId).then((user) => {
      res.render('smartmirror', {
        user: user,
      });
    });
  });

router.route('/module/:module')
  .get((req, res) => {

    smartmirrorController.getWidget(req.params.module)
    .then((widget) => {

      let ctrl = './../controllers/modules/' + widget.module.name;
      let Modul = require(ctrl);

      Modul.get(widget.settings)
      .then((data) => {
        let view = 'modules/' + widget.module.name + '.jade';
        res.render(view, {
          feed: data,
        });
      });
    });
  });

module.exports = router;
