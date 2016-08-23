'use strict';

// Modules
var express = require('express');
var router = express.Router();

// Models
var User = require('./../models/users');
var Gesture = require('./../models/gesture');

// Controllers
var userCtrl = require('../controllers/user');
var gestureCtrl = require('../controllers/gesture');
var systemCtrl = require('./../controllers/system');
var modulesCtrl = require('./../controllers/modules');
var widgetsCtrl = require('./../controllers/widgets');
var socketCtrl = require('./../controllers/socket');

/* GET backend landing page. */
router.route('/')
  .get((req, res, next) => {

    let params = {};

    systemCtrl.os()
    .then((os) => {
      params.os = os;
      return systemCtrl.disk();
    })
    .then((disk) => {
      params.disk = disk;
      return systemCtrl.temp();
    })
    .then((temp) => {
      params.temp = temp;
      res.render('backend/index', params);
    })
    .catch((err) => {
      console.error(err);
      res.send(500);
    });

  });

// User overview, add user
router.route('/users')
  .get((req, res) => {
    userCtrl.getUsers()
    .then((users) => {
      res.render('backend/users', {
        users: users,
      });
    })
    .catch((err) => {
      console.log(err);
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

// User Details, edit user
router.route('/users/:user/')
  .get((req, res) => {
    userCtrl.getUserById({id: req.params.user})
    .then((user) => {
      res.render('backend/user_details', {
        user: user,
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

/* GET sensors overview */
router.route('/sensors')
  .get((req, res) => {
    // Load sensors initial page
    res.render('backend/sensors')
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  })
  .post((req, res) => {
    res.redirect('/gestures/' +  req.body.user);
  });


/* GET list users to load gesture-widget configuration for a a certain user */
router.route('/gesture_interface')
  .get((req, res) => {
    // Save initial gestures
    gestureCtrl.initialize();
    userCtrl.getUsers()
    .then((users) => {
      res.render('backend/gesture_interface', {
        users: users,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  })
  .post((req, res) => {
    res.redirect('/gestures/' +  req.body.user);
  });

/* GET get and create a widget-gesture mapping */
router.route('/gestures/:user')
  .get((req, res) => {
    var params = {};
    // Load user by id
    userCtrl.getUserById({id: req.params.user})
    .then((user) => {
      params.user = user;
      // Load all widgets
      return widgetsCtrl.getGestureSupportWidgets();
    })
    .then((widgets) => {
      params.widgets = widgets;
      // Load user widgets without assigned gesture
      return widgetsCtrl.userGestureWidgets(params);
    })
    .then((data) => {
      console.log('USER WIDGETS: '+ JSON.stringify(data.user.widgets));
      params.userWidgets = data.widgets;
      // Load all available gestures
      return gestureCtrl.getGestures();
    })
    .then((gestures) => {
        params.gestures = gestures;
        res.render('backend/gesture', {
            user: params.user,
            userWidgets: params.userWidgets,
            gestures: gestures,
          });
      });
  })
  // Add a new widget-gesture mapping
  .post((req, res) => {
    let params = {};
    params.widgetId = req.body.widget;
    params.gestureId = req.body.gesture
    params.status = true;
    widgetsCtrl.addGestureToWidget(params)
    .then((widget) => {
      return gestureCtrl.updateGesture(params);
    })
    .then((msg) => {
      res.redirect('/gestures/' +  req.params.user + '?msg=created');
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/?error');
    });
  });

/* GET delete a widget-gesture mapping */
router.route('/gestures/:widget/delete')
  .get((req, res) => {
    let params = {};
    params.widget = req.params.widget;
    widgetsCtrl.deleteGestureOfWidget(params)
    .then((data) => {
      let backURL = req.header('Referer') || '/';
      if (backURL.indexOf('msg') === -1) {
        backURL += '?msg=removed';
      }
      res.redirect(backURL);
    })
  })

/* GET edit a widget-gesture mapping */
router.route('/gestures/:widget/edit')
  .get((req, res) => {
    res.redirect('/widgets/edit/' + req.params.widget);
  });

/* GET system config page. */
router.route('/system')
  .get((req, res, next) => {
    let params = {};
    userCtrl.getUsers()
    .then((users) => {
      params.users = users;
      return systemCtrl.get();
    })
    .then((system) => {
      params.system = system;
      if (params.system === null) {
        params.system =  {
          wifi: {
            ssid: '',
            mac: '',
            security: [],
            password: '',
          },
        };
      }
      res.render('backend/system', params);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
  });

router.route('/system/wlan')
  .post((req, res, next) => {
    systemCtrl.update(req.body)
    .then((system) => {
      res.redirect('/system');
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
  });

router.route('/system/user')
  .post((req, res, next) => {
    systemCtrl.updateUser(req.body)
    .then((system) => {
      res.redirect('/system');
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
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
      return modulesCtrl.compareModules(params);
    })
    .then((params) => {
      params = params;
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

router.route('/modules/install')
  .post((req, res) => {
    modulesCtrl.installModule({
      url: req.body.url,
    })
    .then((module) => {
      res.redirect('/modules?msg=install');
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
  });

router.route('/modules/remove/:id')
  .get((req, res) => {
    modulesCtrl.checkModule({id: req.params.id})
    .then((widgets) => {
      return modulesCtrl.getModuleById({id: req.params.id});
    })
    .then((module) => {
      res.render('backend/modules_remove', {
        module: module,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/modules?err=delete');
    });
  })
  .post((req, res) => {
    modulesCtrl.removeModule({
      id: req.params.id,
      name: req.body.name,
    })
    .then(() => {
      res.redirect('/modules?msg=delete');
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
      return widgetsCtrl.getWidgets();
    })
    .then((widgets) => {
      params.widgets = widgets;
      return userCtrl.getUsers();
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
  .get((req, res) => {
    //    Var modules;
    let params = {};
    modulesCtrl.getModuleById({id: req.params.module})
    .then((module) => {
      params.module = module;
      return gestureCtrl.getGestures();
    })
    .then((gestures) => {
      params.gestures = gestures;
      res.render('backend/widget_create', params);
    })

    .catch((err) => {
      console.log(err);
      res.send(404);
    });
  })
  .post((req, res) => {
    widgetsCtrl.createWidget({
      module: req.params.module,
      widget: req.body,
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
    let params = {};
    widgetsCtrl.getWidget({id: req.params.widget})
    .then((widget) => {
      params.widget = widget;
      return modulesCtrl.getModuleById({id: widget.module});
    })
    .then((module) => {
      params.module = module;
      return gestureCtrl.getGestures();
    })
    .then((gestures) => {
      params.gestures = gestures;
      res.render('backend/widget_details', params);
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/widgets?err=install');
    });
  })
  .post((req, res) => {
    widgetsCtrl.getWidget({id: req.params.widget})
    .then((widget) => {
      if (widget.gesture !== null) {
        console.log('go into if');
        // Unassign existing gesture
        let params = {};
        params.gestureId = widget.gesture._id;
        params.status = false;
        return gestureCtrl.updateGesture(params);
      } else {
        // No existing gesture available
        return '';
      }
    })
    .then((gesture) => {
        return widgetsCtrl.updateWidget({
          id: req.params.widget,
          update: req.body,
        });
      })
    .then((widget) => {
      // Assign new gesture
      let params = {};
      params.gestureId = req.body.gesture;
      params.status = true;
      return gestureCtrl.updateGesture(params);
    })
    .then((gesture) => {
      res.redirect('/widgets?msg=updated');
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  });

router.route('/widgets/remove/:widget')
  .get((req, res) => {

    userCtrl.getUsers()
    .then((users) => {
      return widgetsCtrl.checkUserForWidget({
        widget: req.params.widget,
        users: users,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/widgets?err=removed');
    })
    .then(() => {
      return widgetsCtrl.deleteWidgetById({widget: req.params.widget});
    })
    .then(() => {
      res.redirect('/widgets?msg=removed');
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  });

router.route('/interface')
  .get((req, res) => {
    userCtrl.getUsers()
    .then((users) => {
      res.render('backend/interface', {
        users: users,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  })
  .post((req, res) => {
    res.redirect('/interface/' +  req.body.user);
  });

router.route('/interface/:user')
  .get((req, res) => {
    var params = {};
    userCtrl.getUserById({id: req.params.user})
    .then((user) => {
      params.user = user;
      return widgetsCtrl.getWidgets();
    })
    .then((widgets) => {
      params.widgets = widgets;
      return widgetsCtrl.userWidgets(params);
    })
    .then((data) => {
      socketCtrl.loadUser({user: params.user._id});
      res.render('backend/interface_details', data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  })
  .post((req, res) => {
    let widgets = JSON.parse(req.body.widgets);
    userCtrl.updateWidgets({
      id: req.params.user,
      widgets: widgets,
    })
    .then(() => {
      socketCtrl.reload();
      res.redirect('/interface/' + req.params.user);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
  });

module.exports = router;