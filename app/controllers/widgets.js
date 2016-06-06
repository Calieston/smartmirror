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
}

exports.updateWidget = function(params) {
  let query = Widgets.findByIdAndUpdate(params.id, params.update, {new: true})
    .lean();

  return query.exec();
}

exports.createWidget = function(params) {
  // Console.log(params);
  let query = Modules.findById(params.module)
    .lean()
    .exec();

  query.then((module) => {

    let settings = {};
    Object.keys(params.form).forEach((key) => {
      if (key.indexOf('settings_') > -1) {
        settings[key.replace('settings_', '')] = params.form[key];
      }
    });

    let newWidget = Widgets({
      module: module._id,
      name: params.form.name,
      settings: settings,
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