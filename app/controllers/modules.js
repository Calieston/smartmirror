'use strict';

var Module = require('./../models/modules');
var https = require('https');
var fs = require('fs');
var path = require('path');

exports.getAll = function(params) {
  let query = Module.find({})
    .lean();

  return query.exec();
};

exports.loadModuleDetails = function(params) {

  const baseUrl = 'https://raw.githubusercontent.com/';
  let url = baseUrl + params.owner + '/' + params.repo + '/master/';

  return loadFileFromServer(url + 'package.json')
  .then((data) => {
    return {
      json: JSON.parse(data),
      url: url,
    };
  });
};

exports.installModule = function(params) {

  let url = params.url;
  let moduleDir = path.join(__dirname, './../modules/', params.name, '/');

  // Cerate module directory
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir);
  }

  var modulePackage;

  loadFileFromServer(url + 'package.json')
  .then((data) => {
    modulePackage = JSON.parse(data);
    return saveFile({
      path: moduleDir + 'package.json',
      data: data,
    });
  })
  .then(() => {
    return loadFileFromServer(url + 'app/controller.js');
  })
  .then((data) => {
    return saveFile({
      path: moduleDir + 'controller.js',
      data: data,
    });
  })
  .then(() => {
    return loadFileFromServer(url + 'app/view.jade');
  })
  .then((data) => {
    return saveFile({
      path: moduleDir + 'view.jade',
      data: data,
    });
  })
  .then(() => {
    let newModule = Module({
      author: modulePackage.author,
      description: modulePackage.description,
      name: modulePackage.name,
      status: 'installed',
      homepage: modulePackage.homepage || '',
      version: modulePackage.version,
    });

    let query = newModule.save();

    return query;
  })
  .catch((err) => {
    console.log(err);
  });
};

function loadFileFromServer(url) {

  return new Promise((resolve, reject) => {

    // Fire the get request
    const request = https.get(url, (response) => {

      // Handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        console.log('Failed to load page, status code: ' + response.statusCode);
        reject(new Error('Failed to load page: ' + response.statusCode));
      }

      // Temporary data holder
      const body = [];

      // On every content chunk, push it to the data array
      response.on('data', (chunk) => {
        body.push(chunk);
      });

      // We are done, resolve promise with those joined chunks
      response.on('end', () => {
        let data = body.join();
        resolve(data);
      });
    });

    // Handle connection errors of the request
    request.on('error', (err) => {
      console.error(err);
      reject(err);
    });
  });
}

function saveFile(params) {

  console.log(params);

  return new Promise((resolve, reject) => {

    let file = fs.writeFile(params.path, params.data, (err) => {

      if (err) {
        reject(err);
      }

      resolve(params.data);
    });
  });
}