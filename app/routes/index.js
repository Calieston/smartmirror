'use strict';

var express = require('express');
var router = express.Router();

var User = require('./../models/users');

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

/* User page. */
router.route('/users')
  .get((req, res, next) => {
    res.render('user', {
      title: 'SmartMirror Backend Add User Profile',
    });
  })
  /* Post Form Data */
  .post((req, res, next) => {

    /* Create new user */
    let newUser = new User({
      name: req.body.name,
      bdate: req.body.bdate,
      theme: req.body.theme,
      active: (req.body.active == 'true' ? true : false),
    });

    /* Save new user */
    let query = newUser.save();
    /* Query Promise */
    query.then((user) => {
      res.redirect('/');
    })
    /* Catch Error */
    .catch((err) => {
      console.error(err);
      res.redirect('/?error=newUser');
    });

  });

/* GET user page. */
router.get('/users/:user', (req, res, next) => {
  res.render('user', {
    title: 'SmartMirror Backend User Profile',
    user: 'User: ' + req.params.user,
  });
});

/* Delete User */
router.get('/users/:user/delete', (req, res, next) => {

  /* Query for deleting a user by id */
  let query = User.findByIdAndRemove(req.params.user).exec();

  /* Query Promise */
  query.then(() => {
    res.redirect('/?msg=userdeleted');
  })
  /* Catch Error */
  .catch((err) => {
    res.redirect('/?error=delete');
  });

});

module.exports = router;
