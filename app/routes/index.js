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
router.route('/')
  .get((req, res, next) => {
    /* Query for finding all users */
    let query = User.find({}).exec();

    /* Query Promise */
    query.then((users) => {
        res.render('backend/index', {
          users: users
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
      res.send(500);
    });
  });


/* GET system config page. */
router.route('/settings')
  .get((req, res, next) => {
    systemCtrl.get().then((system) => {
      res.render('backend/settings', {
        system: system.wifi,
      });
    });
  })
  .post((req, res, next) => {
    systemCtrl.update(req.body).then((system) => {
      res.render('backend/settings', {
        system: system.wifi,
      });
    })
    .catch((err) => {
      console.error(err);
      res.send(500);
    });
  });

/* Modules */
router.route('/modules')
  .get((req, res, next) => {
    var params = {};

    modulesCtrl.getModules()
    .then((modules) => {
      params.modules = modules;
      return modulesCtrl.loadModules();
    })
    .then((server) => {
      params.server = JSON.parse(server);
      res.render('backend/modules', {
        modules: params.modules,
        server: params.server,
        get: req.query || false,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      res.render('backend/modules', {
        modules: params.modules || [],
        server: params.server || [],
        get: req.query || false,
      });
    });
  });

/*router.route('/modules/details')
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
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  });*/

router.route('/modules/install')
  .post((req, res) => {
    modulesCtrl.installModule({
      url: req.body.url
    })
    .then((module) => {
      res.redirect('/modules?msg=install');
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  });

router.route('/modules/remove/:id')
  .get((req, res) => {
    modulesCtrl.checkModule({id: req.params.id})
    .then((widgets) => {
      return modulesCtrl.getModule({id: req.params.id});
    })
    .then((module) => {
      console.log(module)
      res.render('backend/modules_remove', {
        module: module
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/modules?err=delete');
    })
  })
  .post((req, res) => {
    modulesCtrl.removeModule({
      id: req.params.id,
      name: req.body.name,
    })
    .then(() => {
      res.redirect('/modules?msg=delete')
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  });

/* Widgets */
router.route('/widgets')
  .get((req, res) => {
    var params = {};
        params.get = req.query || false;

    modulesCtrl.getModules()
    .then((modules) => {
      params.modules = modules;
      return widgetsCtrl.getWidgets()
    })
    .then((widgets) => {
      params.widgets = widgets;
      return userCtrl.getUsers()
    })
    .then((users) => {
      params.users = users;
      res.render('backend/widgets', params);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
  });

router.route('/widgets/create/:module')
  .post((req, res) => {
    widgetsCtrl.createWidget({
      module: req.params.module,
      form: req.body,
    })
    .then((data) => {
      res.redirect('/widgets?msg=install');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/widgets?err=install');
    });
  });

router.route('/widgets/edit/:widget')
  .get((req, res) => {
    console.log()
    widgetsCtrl.getWidget({id: req.params.widget})
    .then((widget) => {
      res.render('backend/widgets_edit', {
        widget: widget,
      })
    });
  })
  .post((req, res) => {
    widgetsCtrl.updateWidget({
      id: req.params.widget,
      update: req.body,
    })
    .then((widget) => {
      res.redirect('/widgets?msg=updated')
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  });

router.route('/widgets/remove/:widget')
  .get((req, res) => {
    widgetsCtrl.deleteWidgetById({widget: req.params.widget})
    .then((widget) => {
      res.redirect('/widgets?msg=removed');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/widgets?err=removed');
    });
  });

router.route('/interface')
  .post((req, res) => {
    res.redirect('/interface/' +  req.body.user);
  })

router.route('/interface/:user')
  .get((req, res) => {
    var params = {};
    userCtrl.getUsers()
    .then((users) => {
      params.users = users;
      return widgetsCtrl.getWidgets()
    })
    .then((widgets) => {
      params.widgets = widgets;
      res.render('backend/interface', params);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
  })
  .post((req, res) => {
    console.log('ToDo');
    // Set position in user model
    res.render('backend/interface');
  });

module.exports = router;