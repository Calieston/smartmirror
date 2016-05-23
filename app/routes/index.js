'use strict';

var express = require('express');
var router = express.Router();
var User = require('./../models/users');
var userController = require('../controllers/user');
var systemController = require('./../controllers/system');
var modulesController = require('./../controllers/modules');

router.route('/users')
  .get(userController.getUsers);

router.route('/users/new')
  .get(userController.getUserCreateForm)
  .post(userController.createUser);

router.route('/users/:user/delete')
  .get(userController.deleteUserById);

router.route('/users/:id/edit')
  .get(userController.getUserById)
  .post(userController.updateUser);

/* GET backend landing page. */
router.get('/', (req, res, next) => {

  /* Query for finding all users */
  let query = User.find({}).exec();

  /* Query Promise */
  query.then((users) => {
      res.render('backend_home', {
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
router.route('/system')
  .get((req, res, next) => {
    systemController.get().then((system) => {
      console.log(system.wifi);
      res.render('backend_systemsettings', {
        title: 'SmartMirror Backend Sytem Config',
        system: system.wifi,
      });
    });
  })
  .post((req, res, next) => {
    systemController.update(req.body).then((system) => {
      res.render('backend_systemsettings', {
        system: system.wifi,
      });
    })
    /* Error Handling */
    .catch((err) => {
      console.error(err);
      res.send(404);
    });
  });

router.route('/modules')
  .get((req, res, next) => {
    modulesController.getAll().then((modules) => {
      res.render('backend_modules', {
        modules: modules,
      });
    });
  });


router.route('/modules/details')
  .post((req, res) => {
    modulesController.loadModuleDetails({
      owner: req.body.owner,
      repo: req.body.repo})
    .then((details) => {
      res.render('backend_modules_details.jade', {
        owner: req.body.owner,
        repo: req.body.repo,
        details: details
      });
    });
  });


module.exports = router;