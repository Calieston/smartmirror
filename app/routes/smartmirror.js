'use strict';
var express = require('express');
var router = express.Router();
var jade = require('jade');
var path = require('path');
var fs = require('fs');
// Var weatherController = require('../controllers/weather');

var smartmirrorCtrl = require('./../controllers/smartmirror');
var socketCtrl = require('./../controllers/socket');
var widgetsCtrl = require('./../controllers/widgets');

/* GET smartmirror interface page. */
router.get('/', (req, res, next) => {

  smartmirrorCtrl.getConfig()
  .then((network) => {
    res.render('welcome', {
      network: network,
    });
  })
  .catch((err) => {
    console.error(err);
    res.send(404);
  });

});

router.route('/default')
  .get((req, res) => {
    smartmirrorCtrl.getDefaultUser()
    .then((user) => {
      res.redirect(user._id);
    })
    .catch((err) => {
      console.error(err);
      res.send(404);
    });
  });

router.route('/:userId')
  .get((req, res) => {
    let params = {};
    var userprofile;
    smartmirrorCtrl.getUser({id: req.params.userId})
    .then((user) => {
      userprofile = user;
      params.user = user;
      return widgetsCtrl.getGestureSupportWidgets();
    })
    .then((widgets) => {
      if (widgets.length > 0) {
        params.userGestureWidgets = widgets;
      }else {
        params.userGestureWidgets = null;
      }
      // Send widgets with gesture support to leap client
      return socketCtrl.transportGestures(params);
    })
    .then((data) => {
      res.render('smartmirror', {
        user: params.user,
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
