'use strict';

var express = require('express');
var router = express.Router();
var User = require('./../models/users');
var userController = require('../controllers/user');

router.route('/users')
  .get(userController.getUsers)

router.route('/users/new')
  .get(userController.getUserCreateForm)
  .post(userController.createUser);

router.route('/users/:user/delete')
  .get(userController.deleteUser);

/* GET backend landing page. */
router.get('/', (req, res, next) => {

  /* Query for finding all users */
  let query = User.find({}).exec();

  /* Query Promise */
  query.then((users) => {
    res.render('backend', {
      title: 'SmartMirror Backend Landingpage',
      users: users,
    });
  })
  /* Error Handling */
  .catch((err) => {
    console.error(err);
    res.send(404);
  });

});

/* GET system config page. */
router.get('/system', (req, res, next) => {
  res.render('index', {
    title: 'SmartMirror Backend Sytem Config',
  });
});


/* GET user page. */
router.get('/users/:user', (req, res, next) => {
  res.render('user', {
    title: 'SmartMirror Backend User Profile',
    user: 'User: ' + req.params.user,
  });
});



module.exports = router;
