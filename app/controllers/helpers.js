'use strict';

var fs = require('fs');
var fse = require('fs-extra');

exports.loadFileFromServer = function(params) {

  return new Promise((resolve, reject) => {

    var http;

    if (params.url.startsWith('https://')) {
      http = require('https');
    } else if (params.url.startsWith('http://')) {
      http = require('http');
    } else {
      let err = new Error('Unvalid URL');
      reject(err);
    }

    // Fire the get request
    http.get(params.url, response => {
      console.log('URL: ' + params.url);
      // Handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        console.log('Failed to load page, status code: ' + response.statusCode);
        reject(new Error('Failed to load page: ' + response.statusCode));
      }

      var file = '';

      // On every content chunk, push it to the data array
      response.on('data', data => {
        file += data;
      });

      // We are done, resolve promise with those joined chunks
      response.on('end', () => {
        resolve(file);
      });
    })
    .on('error', err => {
      console.log(err);
      reject(err);
    });
  });
};

exports.saveFile = function(params) {

  return new Promise((resolve, reject) => {

    let file = fs.writeFile(params.path, params.data, (err) => {

      if (err) {
        console.log(err);
        reject(err);
      }

      resolve(params.data);
    });
  });
};

exports.copyFile = function(params) {

  return new Promise((resolve, reject) => {
    var msg;
    if (!fs.existsSync(params.oldPath)) {
      reject();
    }

    fse.copy(params.oldPath, params.newPath, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve();
    });
  });

}
exports.removeFile = function(params) {

  return new Promise((resolve, reject) => {

    if (!fs.existsSync(params.path)) {
      reject();
    }

    fs.unlink(params.path, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve();
    });

  });
};