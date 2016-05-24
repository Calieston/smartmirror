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

  return loadFileFromServer({url: url + 'package.json'})
  .then((data) => {
    return {
      json: JSON.parse(data),
      url: url,
    };
  });
};

exports.installModule = function(params) {

  let url = params.url;
  var modulePackage;

  loadFileFromServer({url: url + 'package.json'})
  .then((data) => {
    modulePackage = JSON.parse(data);
  })
  .then(() => {
    return loadFileFromServer({url: url + 'app/controller.js'});
  })
  .then((data) => {
    return saveFile({
      path: path.join(__dirname, './../controllers/modules/', params.name + '.js'),
      data: data,
    });
  })
  .then(() => {
    return loadFileFromServer({url: url + 'app/view.jade'});
  })
  .then((data) => {
    return saveFile({
      path: path.join(__dirname, './../views/modules/', params.name + '.jade'),
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
      settings: modulePackage.smartmirror || null,
    });

    let query = newModule.save();

    return query;
  })
  .catch((err) => {
    console.log(err);
  });
};

function loadFileFromServer(params) {

  return new Promise((resolve, reject) => {

    // Fire the get request
    const request = https.get(params.url, (response) => {

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
      console.log(err);
      reject(err);
    });
  });
}

function saveFile(params) {

  console.log(params)

  return new Promise((resolve, reject) => {

    let file = fs.writeFile(params.path, params.data, (err) => {

      if (err) {
        console.log(err);
        reject(err);
      }

      resolve(params.data);
    });
  });
}

function removeDir(params) {

  return new Promise((resolve, reject) => {

    if (!fs.existsSync(params.path)) {
      reject();
    }

    let files = fs.readdirSync(params.path);

    resolve(files);

  });
}