'use strict';

var Modules = require('./../models/modules');
var Widgets = require('./../models/widgets');
var Users = require('./../models/users');
var gestureCtrl = require('./gesture');

exports.getWidgets = function(params) {
  let query = Widgets.find({})
    .populate('module')
    .populate('gesture')
    .lean();

  return query.exec();
};

exports.getGestureSupportWidgets = function(params) {
  let query = Widgets.find({gestureSupport: true})
    .populate('module')
    .populate('gesture')
    .lean();

  return query.exec();
};

/**
exports.getGestureSupportAssignedWidgets = function(params) {
  let query = Widgets.find({
      gestureSupport: true,
    }).where("gesture").ne(null)
    .populate('module')
    .lean();

  return query.exec();
};*/

exports.getWidget = function(params) {
  let query = Widgets.findById(params.id)
    .populate('gesture')
    .lean();
  return query.exec();
};

exports.updateWidget = function(params) {
  var query = Widgets.findByIdAndUpdate(params.id, params.update, {new: true})
  .populate('gesture')
  .lean();

  return query.exec();
};

exports.createWidget = function(params) {
  let query = Modules.findById(params.module)
    .lean()
    .exec();

  let widget = params.widget;

  query.then((module) => {

    let settings = {};
    Object.keys(widget).forEach((key) => {
      if (key.indexOf('settings_') > -1) {
        settings[key.replace('settings_', '')] = widget[key];
      }
    });

    let newWidget = Widgets({
      module: module._id,
      name: widget.name,
      settings: settings,
      gesture: widget.gesture,
      gestureSupport: module.gestureSupport,
      size: module.size[0],
    });

    // update assignee status for gesture
    params = {};
    params.gestureId = widget.gesture;
    params.status = true;
    gestureCtrl.updateGesture(params);

    return newWidget.save();
  })
  .catch((err) => {
    console.log(err);
  });
  return query;
};

exports.addGestureToWidget = function(params) {
  let query = Widgets.findByIdAndUpdate(params.widgetId, {
    gesture: params.gestureId,
  }, {
    new: true,
  })
  .lean();

  return query.exec();
};

exports.checkUserForWidget = function(params) {

  return new Promise((resolve, reject) => {
    params.users.forEach((user) => {
      user.widgets.forEach((widget) => {
        if (widget._id == params.widget) {
          var err = new Error('Widget in Use');
          reject({
            err: err,
            user: user,
          });
        }
      });
    });
    resolve();
  });
};

// Delete a gesture widget assignment
exports.deleteGestureOfWidget = function(params) {
  var widgetId = params.widget;
  let wQuery = Widgets.findById(params.widget)
    .lean()
    .exec();

  wQuery.then((widget) => {
    // update assignee status for gesture
    params = {};
    params.gestureId = widget.gesture;
    params.status = false;
    return gestureCtrl.updateGesture(params);
    })
    .then((gesture) => {
      // delete gesture field in widget
      let query = Widgets.findByIdAndUpdate(widgetId, {
        gesture: undefined,
      }, {
        new: true
      })
        .lean();
      return query.exec();
    });
    return wQuery;
};

exports.deleteWidgetById = function(params) {
  var widgetId = params.widget;
  let wQuery = Widgets.findById(params.widget)
    .lean()
    .exec();

  // update assignee status for gesture
  wQuery.then((widget) => {
    params = {};
    params.gestureId = widget.gesture;
    params.status = false;
    return gestureCtrl.updateGesture(params);
    })
    .then((data) => {
      // remove widget
      let query = Widgets.findByIdAndRemove(widgetId)
      .lean();
      return query.exec();
    });
};

exports.userWidgets = function(params) {
  return new Promise((resolve, reject) => {

    params.user.widgets.forEach((uwidget, i) => {
      params.widgets.some((widget, j) => {
        if (widget._id.equals(uwidget._id)) {
          uwidget.name = widget.name;
          uwidget.size = widget.size;
          params.widgets.splice(j, 1);
          return true;
        }
      });
    });

    resolve(params);
  });
};
