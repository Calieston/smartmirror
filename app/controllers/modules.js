'use strict';

var Modules = require('./../models/modules');
var Users = require('./../models/users');
var Widgets = require('./../models/widgets');
var Helpers = require('./helpers');
var fs = require('fs');
var path = require('path');

exports.loadModules = function (params) {
  return Helpers.loadFileFromServer({url: 'http://localhost:3333/api/getModules'});
}

exports.getModules = function(params) {
  let query = Modules.find({})
    .lean();

  return query.exec();
};

exports.loadModuleDetails = function(params) {

  const baseUrl = 'https://raw.githubusercontent.com/';
  let url = baseUrl + params.owner + '/' + params.repo + '/master/';

  return Helpers.loadFileFromServer({url: url + 'package.json'})
  .then((data) => {
    return {
      json: JSON.parse(data),
      url: url,
    };
  });
};

exports.installModule = function(params) {

  const url = 'https://raw.githubusercontent.com/' + params.url.slice(19) + '/master/';
  var modulePackage;

  return Helpers.loadFileFromServer({url: url + 'package.json'})
  .then((data) => {
    modulePackage = JSON.parse(data);
  })
  .then(() => {
    return Helpers.loadFileFromServer({url: url + 'app/controller.js'});
  })
  .then((data) => {
    return Helpers.saveFile({
      path: path.join(__dirname, './../controllers/modules/', modulePackage.name + '.js'),
      data: data,
    });
  })
  .then(() => {
    return Helpers.loadFileFromServer({url: url + 'app/view.jade'});
  })
  .then((data) => {
    return Helpers.saveFile({
      path: path.join(__dirname, './../views/modules/', modulePackage.name + '.jade'),
      data: data,
    });
  })
  .then(() => {
    let newModule = Modules({
      author: modulePackage.author,
      description: modulePackage.description,
      name: modulePackage.name,
      status: 'installed',
      homepage: modulePackage.homepage || '',
      version: modulePackage.version,
      settings: modulePackage.smartmirror || null,
    });

    return newModule.save();
  })
  .catch((err) => {
    console.log(err);
    return err;
  });
};

exports.getModule = function(params) {
  let query =  Modules.findById(params.id)
    .lean();

  return query.exec()
}

exports.checkModule = function(params) {
  return new Promise((resolve, reject) => {

    let query = Widgets.find({module: params.id}).exec();

    query.then((widgets) => {
      if(widgets.length > 0) {
        console.log(widget)
        let err = new Error('Module has Widgets');
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

exports.removeModule = function(params) {

  return Helpers.removeFile({
    path: path.join(__dirname, './../controllers/modules/', params.name + '.js'),
  })
  .then(() => {
    return Helpers.removeFile({
      path: path.join(__dirname, './../views/modules/', params.name + '.jade'),
    });
  })
  .then(() => {
    return Modules.findByIdAndRemove(params.id).exec();
  });

}

