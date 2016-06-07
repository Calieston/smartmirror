'use strict';

var fs = require('fs');

exports.loadFileFromServer = function(params) {

  return new Promise((resolve, reject) => {

    var server;

    if (params.url.startsWith('https://')) {
      server = require('https');
    } else if (params.url.startsWith('http://')) {
      server = require('http');
    } else {
      let err = new Error('Unvalid URL');
      reject(err);
    }

    // Fire the get request
    const request = server.get(params.url, (response) => {

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