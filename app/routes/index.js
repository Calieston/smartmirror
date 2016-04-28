var express = require('express');
var router = express.Router();

/* GET backend landing page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SmartMirror Backend Landingpage' });
});

/* GET system config page. */
router.get('/system', function(req, res, next) {
  res.render('index', { title: 'SmartMirror Backend Sytem Config' });
});

/* GET user page. */
router.get('/user/:user', function(req, res, next) {
  res.render('user', {
    title: 'SmartMirror Backend User Profile',
    user: 'User: ' + req.params.user,
  });
});

module.exports = router;
