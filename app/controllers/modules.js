'use strict';

var Modules = require('./../models/modules');
var Users = require('./../models/users');
var Widgets = require('./../models/widgets');
var Helpers = require('./helpers');
var fs = require('fs');
var path = require('path');
var npm = require('npm');

var config = require('./../config');

const moduleServer = config.moduleServer;

exports.loadModules = function(params) {
  return Helpers.loadFileFromServer({
    url: moduleServer + '/api/getModules',
  });
};

exports.getModules = function(params) {
  let query = Modules.find({})
    .lean();

  return query.exec();
};

exports.installModule = function(params) {

  const url = 'https://raw.githubusercontent.com/' +
    params.url.slice(19) +
    '/master/';
  var dir = path.join(__dirname, './../#/modules/');

  var modulePackage;

  return Helpers.loadFileFromServer({url: url + 'package.json'})
  .then((data) => {
    modulePackage = JSON.parse(data);
    if (modulePackage.dependencies) {
      return new Promise((resolve, reject) => {
        let modules = [];

        for (var dependency in modulePackage.dependencies) {
          modules.push(dependency + '@' + modulePackage.dependencies[dependency]);
        }

        npm.load({
            global: true,
            prefix: path.join(__dirname, 'modules'),
          }, (err) => {

          if (err) {
            console.log(err);
            reject(err);
          }

          npm.commands.install(modules, function(er, data) {
            console.log(err);
            reject(err);
          });

          npm.on('log', function(message) {
            console.log(message);
          });

        });

        resolve();
      });
    }
  })
  .then(() => {
    dir += modulePackage.name;
    return Helpers.loadFileFromServer({url: url + 'app/controller.js'});
  })
  .then((data) => {
    return Helpers.saveFile({
      path: dir.replace('#', 'controllers') + '.js',
      data: data,
    });
  })
  .then(() => {
    return Helpers.loadFileFromServer({url: url + 'app/view.jade'});
  })
  .then((data) => {
    return Helpers.saveFile({
      path: dir.replace('#', 'views') + '.jade',
      data: data,
    });
  })
  .then(() => {
    console.log(modulePackage.smartmirror.settings);
    let query = Modules.findOneAndUpdate({
      name: modulePackage.name,
    }, {
      author: modulePackage.author,
      description: modulePackage.description,
      name: modulePackage.name,
      status: 'installed',
      homepage: modulePackage.homepage || '',
      version: modulePackage.version,
      settings: modulePackage.smartmirror.settings || null,
      size: modulePackage.smartmirror.size,
      gestureSupport: modulePackage.smartmirror.gestureSupport,
    }, {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true,
    })
    .lean();

    return query.exec();
  })
  .catch((err) => {
    console.log(err);
    return err;
  });
};

exports.getModuleById = function(params) {
  let query =  Modules.findById(params.id)
    .lean();

  return query.exec();
};

exports.checkModule = function(params) {
  return new Promise((resolve, reject) => {

    let query = Widgets.find({module: params.id}).exec();

    query.then((widgets) => {
      if (widgets.length > 0) {
        let err = new Error('Module has Widgets');
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.removeModule = function(params) {

  const dir = path.join(__dirname, './../#/modules', params.name);

  return Helpers.removeFile({
    path: dir.replace('#', 'controllers') + '.js',
  })
  .then(() => {
    return Helpers.removeFile({
      path: dir.replace('#', 'views') + '.jade',
    });
  })
  .then(() => {
    return Modules.findByIdAndRemove(params.id).exec();
  });
};

exports.compareModules = function(params) {

  return new Promise((resolve, reject) => {
    for (var i = 0; i < params.modules.length; i++) {
      for (var j = 0; j < params.server.length; j++) {
        if (params.modules[i].name === params.server[j].name) {
          if (params.modules[i].version != params.server[j].version) {
            params.server[j].status = 'update';
            break;
          }
          params.server[j].status = 'installed';
          break;
        }
      }
    }

    resolve(params);

  });
};