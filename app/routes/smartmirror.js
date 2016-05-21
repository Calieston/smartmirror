'use strict';
var express = require('express');
var router = express.Router();
var jade = require('jade');
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

    smartmirrorController.getWidget(req.params.module).then((widget) => {
      let Module = require(
        './../modules/' + widget.module.name + '/controller.js');
      let test = Module.get(widget.settings);

      console.log(test);

      res.send(test);
    });
  })
  .post((req, res) => {
    res.send('Widget.POST ' + req.params.module);
  });

module.exports = router;
