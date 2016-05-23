'use strict';

var Module = require('./../models/modules');
var https = require('https');
var fs = require('fs');

exports.getAll = function(params) {
  let query = Module.find({})
    .lean();

  return query.exec();
};

exports.loadModuleDetails = function(params) {

  return new Promise((resolve, reject) => {

    const baseUrl = 'https://raw.githubusercontent.com/#/master/package.json';

    let requestUrl = baseUrl.replace('#', params.owner + '/' + params.repo);

    // fire the get request
    const request = https.get(requestUrl, (response) => {

      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load page, status code: ' + response.statusCode));
      }

      // temporary data holder
      const body = [];

      // on every content chunk, push it to the data array
      response.on('data', (chunk) => {
        body.push(chunk);
      });

      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        let json = JSON.parse(body.join(''));
        resolve(json);
      });
    });

    // handle connection errors of the request
    request.on('error', (err) => {
      reject(err)
    });
  });
}