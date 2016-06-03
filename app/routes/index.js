'use strict';

// Modules
var express = require('express'),
    router = express.Router();

// Models
var User = require('./../models/users');

// Controllers
var userCtrl = require('../controllers/user');
var systemCtrl = require('./../controllers/system');
var modulesCtrl = require('./../controllers/modules');
var widgetsCtrl = require('./../controllers/widgets');

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

// User overview, add user
router.route('/users')
  .get((req, res) => {
    userCtrl.getUsers()
    .then((users) => {
      res.render('backend/users', {
        users: users
      });
    })
    .catch((err) => {
      res.redirect('/?error');
    });
  })
  .post((req, res) => {
    userCtrl.addUser(req.body)
    .then((user) => {
      res.redirect('/users');
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/?error');
    });
  });

// user Details, edit user
router.route('/users/:user/')
  .get((req, res) => {
    userCtrl.getUserById({id: req.params.user})
    .then((user) => {
      res.render('backend/user_details', {
        user: user
      });
    })
    .catch((err) => {
      res.redirect('/users?error');
    });
  })
  .post((req, res) => {
    userCtrl.updateUser(req.body)
    .then((user) => {
      res.redirect('/users');
    })
    .catch((err) => {
      res.redirect('/users?error');
    });
  });

// Delete user
router.route('/users/:user/delete')
  .get((req, res) => {
    userCtrl.deleteUserById({id: req.params.user})
    .then((msg) => {
      res.redirect('/users?msg=deleted');
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/users?error');
    });
  });


/* GET system config page. */
router.route('/settings')
  .get((req, res, next) => {
    systemCtrl.get().then((system) => {
      console.log('Tick');
      console.log(system);
      res.render('backend/settings', {
        system: system.wifi,
      });
    });
  })
  .post((req, res, next) => {
    systemCtrl.update(req.body).then((system) => {
      console.log('Trick');
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
    modulesCtrl.getAll().then((modules) => {
      res.render('backend/modules', {
        modules: modules,
      });
    });
  });

router.route('/modules/details')
  .post((req, res) => {
    modulesCtrl.loadModuleDetails({
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
    modulesCtrl.installModule({
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
    modulesCtrl.getAll()
    .then((modules) => {
      widgetsCtrl.getAll()
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
    widgetsCtrl.createWidget({
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
    widgetsCtrl.deleteWidgetById({widget: req.params.widget})
    .then((widget) => {
      res.redirect('/widgets?status=widgetremoved');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/widgets?status=error');
    });
  });


module.exports = router;