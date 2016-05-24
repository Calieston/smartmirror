'use strict';

var Module = require('./../models/modules');
var Widget = require('./../models/widgets');


exports.getAll = function(params) {
  let query = Widget.find({})
    .lean();

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

    return newWidget;
  })
  .catch((err) => {
    console.log(err);
  });
  return query;
};


exports.deleteWidgetById = function(params) {

  let query = Widget.findByIdAndRemove(params.widget);

  return query.exec();
};

/*exports.loadModuleDetails = function(params) {

  const baseUrl = 'https://raw.githubusercontent.com/';
  let url = baseUrl + params.owner + '/' + params.repo + '/master/';

  return loadFileFromServer({url: url + 'package.json'})
  .then((data) => {
    return {
      json: JSON.parse(data),
      url: url,
    };
  });
};
*/
