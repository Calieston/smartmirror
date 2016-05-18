'use strict';

var express = require('express');
var router = express.Router();


/* GET smartmirror interface page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'SmartMirror Interface' });
});

router.get('/:id', (req, res, next) => {
  res.render('index', {title:'Smartmirror user: ' + req.params.id});
});

module.exports = router;
