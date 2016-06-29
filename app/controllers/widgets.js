'use strict';

var Modules = require('./../models/modules');
var Widgets = require('./../models/widgets');
var Users = require('./../models/users');

exports.getWidgets = function(params) {
  let query = Widgets.find({})
    .populate('module')
    .lean();

  return query.exec();
};

exports.getWidget = function(params) {
  let query = Widgets.findById(params.id)
    .lean();
  return query.exec();
};

exports.updateWidget = function(params) {
  let query = Widgets.findByIdAndUpdate(params.id, params.update, {new: true})
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
      size: module.size[0],
    });

    return newWidget.save();
  })
  .catch((err) => {
    console.log(err);
  });
  return query;
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

exports.deleteWidgetById = function(params) {
  let query = Widgets.findByIdAndRemove(params.widget)
    .lean();

  return query.exec();
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