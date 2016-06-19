'use strict';

var Modules = require('./../models/modules');
var Widgets = require('./../models/widgets');


exports.getWidgets = function(params) {
  let query = Widgets.find({})
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

exports.deleteWidgetById = function(params) {

  let query = Widgets.findByIdAndRemove(params.widget)
    .lean();

  // Todo
  // Search for all users who have the widget, remove it

  return query.exec();
};