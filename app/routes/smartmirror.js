'use strict';
var express = require('express');
var router = express.Router();
var jade = require('jade');
var path = require('path');
var fs = require('fs');
// Var weatherController = require('../controllers/weather');

var smartmirrorCtrl = require('./../controllers/smartmirror');

/* GET smartmirror interface page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'SmartMirror Interface' });
});

router.route('/:userId')
  .get((req, res) => {
    smartmirrorCtrl.getUser({id: req.params.userId}).then((user) => {
      console.log(user.widgets)
      res.render('smartmirror', {
        user: user,
      });
    })
    .catch((err) => {
      console.error(err);
      res.send(404);
    });
  });

router.route('/widget/:id')
  .get((req, res) => {

    let params = {};

    smartmirrorCtrl.getWidget({id: req.params.id})
    .then((widget) => {

      params.widget = widget;

      let ctrl = './../controllers/modules/' + params.widget.module.name;
      let Modul = require(ctrl);

      return Modul.get(params.widget.settings);
    })
    .then((data) => {
      let view = 'modules/' + params.widget.module.name + '.jade';
      res.render(view, {
        data: data,
        widget: params.widget,
      });
    })
    .catch((err) => {
      console.error(err);
      res.send(404);
    });

  });

module.exports = router;
