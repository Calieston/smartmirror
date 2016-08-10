'use strict';

var request = require('request');
var fs = require('fs');
var config = require('./../config');
var path = require('path');
var socketCtrl = require('./socket');

const key = config.googleSpeechApiKey;
const file = config.fileName;
const lang = config.language;
var urlStart = 'https://www.google.com/speech-api/v2/recognize?key=' + key;
var urlEnd = '&lang=' + lang + '&output=json';
var filePath = path.join(__dirname, './../../samples/' + file);


// Parse audio file
exports.speechToText = function() {
  return new Promise((resolve, reject) => {

    // Parse audio file after finished recording
    setTimeout(function() {
      try {
        // Check if file is available
        fs.accessSync(filePath, fs.F_OK);
        fs.readFile(filePath, function(err, data) {
          if (err) {
            reject(err);
          }
          var r = request.post({
            url: urlStart + urlEnd,
            headers: {
              'Content-Type': 'audio/l16; rate=16000;',
            },
            body: data,
          }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
              if (error) {
                reject(error);
              }
              // Ignore first empty response
              var body = body.split('\n')[1];
              // Check if response exists
              var response = 'empty';
              if (body.indexOf('result') > -1) {
                // Parse to JSON
                var jObj = JSON.parse(body);
                response = jObj.result['0'].alternative['0'].transcript;
              }
              // Fs.unlinkSync(filePath);
              resolve(response);
            }
          });
        });
      } catch (e) {
        console.log('requested file ' + file + ' not found');
        resolve('empty');
      }
    }, 5000);

  });
}

exports.createVoiceMemo = function() {
  }
exports.playVoiceMemo = function() {
  }
exports.deleteVoiceMemo = function() {
    let voiceMemoFilePath;
    fs.unlinkSync(voiceMemoFilePath);
  }