'use strict';

var Module = require('./../models/modules');
var Widget = require('./../models/widgets');


exports.getAll = function(params) {
  let query = Widget.find({})
    .lean();

    // ToDo: All widgets or all user widgets?

  return query.exec();
};

exports.createWidget = function(params) {
  // Console.log(params);
  let query = Module.findById(params.module)
    .lean()
    .exec();

  query.then((module) => {
    let settings = {};
    Object.keys(params.form).forEach((key) => {
      if (key.indexOf('settings_') > -1) {
        settings[key.replace('settings_', '')] = params.form[key];
      }
    });

    let newWidget = Widget({
      module: query._id,
      name: params.form.name,
      settings: settings,
    });

    newWidget.save();

    newWidget.then((widget) => {
      //todo add widget to  userprofile
    });

    return newWidget;
  })
  .catch((err) => {
    console.log(err);
  });
  return query;
};


exports.deleteWidgetById = function(params) {

  let query = Widget.findByIdAndRemove(params.widget);

  // Todo
  // Search for all users who have the widget, remove it

  return query.exec();
};