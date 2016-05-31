'use strict';

var express = require('express');
var router = express.Router();
var User = require('./../models/users');
var userController = require('../controllers/user');
var systemController = require('./../controllers/system');
var modulesController = require('./../controllers/modules');
var widgetsController = require('./../controllers/widgets');

/*router.route('/users')
  .get(userController.getUsers);
*/
router.route('/users/')
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
      res.render('backend/index', {
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
router.route('/settings')
  .get((req, res, next) => {
    systemController.get().then((system) => {
      res.render('backend/settings', {
        title: 'SmartMirror Backend Sytem Config',
        system: system.wifi,
      });
    });
  })
  .post((req, res, next) => {
    systemController.update(req.body).then((system) => {
      res.render('backend/settings', {
        system: system.wifi,
      });
    })
    /* Error Handling */
    .catch((err) => {
      console.error(err);
      res.send(404);
    });
  });

/* Modules */
router.route('/modules')
  .get((req, res, next) => {
    modulesController.getAll().then((modules) => {
      res.render('backend/modules', {
        modules: modules,
      });
    });
  });

router.route('/modules/details')
  .post((req, res) => {
    modulesController.loadModuleDetails({
      owner: req.body.owner,
      repo: req.body.repo,})
    .then((data) => {
      res.render('backend/modules_details.jade', {
        owner: req.body.owner,
        repo: req.body.repo,
        details: data.json,
        package: JSON.stringify(data.json),
        url: data.url,
      });
    });
  });

router.route('/modules/install')
  .post((req, res) => {
    modulesController.installModule({
      url: req.body.url,
      name: req.body.name,
    });
    res.redirect('/modules?msg=moduleinstalling');
  });

router.route('/modules/remove')
  .get((req, res) => {
    res.send('ToDo');
  });

/* Widgets */
router.route('/widgets')
  .get((req, res) => {
    modulesController.getAll()
    .then((modules) => {
      widgetsController.getAll()
      .then((widgets) => {
        return {
          widgets: widgets,
          modules: modules,
        };
      })
      .then((params) => {
        res.render('backend/widgets', {
          widgets: params.widgets,
          modules: params.modules,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(404);
    });
  });

router.route('/widgets/create/:module')
  .post((req, res) => {
    widgetsController.createWidget({
      module: req.params.module,
      form: req.body,
    })
    .then((data) => {
      res.redirect('/widgets?status=moduleinstalled');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/widgets?status=error');
    });
  });

router.route('/widgets/edit/:widget')
  .get((req, res) => {
    res.send('Todo');
  });

router.route('/widgets/remove/:widget')
  .get((req, res) => {
    widgetsController.deleteWidgetById({widget: req.params.widget})
    .then((widget) => {
      res.redirect('/widgets?status=widgetremoved');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/widgets?status=error');
    });
  });


module.exports = router;