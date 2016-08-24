'use strict';

var request = require('request');
var fs = require('fs');
var config = require('./../config');
var path = require('path');
var memoCtrl = require('./memo');
var Helpers = require('./helpers');

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
            console.log('ERROR in speech.js: ' + err);
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
                response = jObj.result['0'].alternative['0'].transcript.toLowerCase();
              }
              fs.unlink(filePath);

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
    // Return new Promise
    return new Promise((resolve, reject) => {
        // TODO: create a copy of file in filepath and delete filepath's file
        let params = {};
        params.name = 'memo';
        params.path = filePath;
        params.author = 'Albert';
        params.lifetime = Date.now();
        memoCtrl.addMemo(params)
        .then((memo) => {
          console.log('Created new memo: ' + JSON.stringify(memo));
          return Helpers.removeFile({path: filePath,})
        });
      });
  }
// TODO: add job which clear old files
exports.playVoiceMemo = function() {
  // Return new Promise
  return new Promise((resolve, reject) => {
      memoCtrl.getRandomVoiceMemo()
     .then((memo) => {
        // Play voice memo on smart mirror
        var exec = require('child_process').exec;
        exec('aplay ' + memo.path, function(error, stdout, stderr) {
              if (error !== null) {
                console.log('exec error: ' + error);
              }else {
                console.log('successful');
                resolve(stdout);
              }
            });
      });

    });
}
exports.deleteVoiceMemo = function() {
    // Return new Promise
    return new Promise((resolve, reject) => {
          memoCtrl.getRandomVoiceMemo()
          .then((memo) => {
            // Delete voice memo file
            return Helpers.removeFile({path: memo.path,})
          })
          .then((msg) => {
            // Delete voice memo entry
            return memoCtrl.deleteMemoById(memo._id);
          })
          .then((msg) => {
              resolve(msg);
            });
        });
  };

