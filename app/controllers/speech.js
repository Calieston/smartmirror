'use strict';

var request = require('request');
var fs = require('fs');
var config = require('./../config');
var path = require('path');
var memoCtrl = require('./memo');
var Helpers = require('./helpers');
var userCtrl = require('./user');

const key = config.googleSpeechApiKey;
const file = config.fileName;
const lang = config.language;
var urlStart = 'https://www.google.com/speech-api/v2/recognize?key=' + key;
var urlEnd = '&lang=' + lang + '&output=json';
var fPath = path.join(__dirname, './../../recordings/');
var filePath = path.join(__dirname, './../../recordings/' + file);


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
                // Parse google speech api response to JSON
                var jObj = JSON.parse(body);
                response = jObj.result['0'].alternative['0'].transcript.toLowerCase();
              }
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

// Load a user profile mirror interface with a voice command
exports.loadUserProfile = function(username) {
      // Return new Promise
      return new Promise((resolve, reject) => {
        Helpers.removeFile({path: filePath,})
          .then((msg) => {
              return userCtrl.getUserByName({
                  username: username,
                })
            .then((user) => {
                  resolve(user);
                });
            });
      });
    }
// Create a new voice memo file and entry in database
exports.createVoiceMemo = function() {
    // Return new Promise
    return new Promise((resolve, reject) => {
        // Create path for voice memo file
        var memoFilePath = fPath + 'memo_' + Date.now() + '.wav';

        // Calculate lifetime for voice memo
        var deletionDate = new Date();
        deletionDate.setDate(deletionDate.getDate() + 1);

        // Preparate params for voice memo entry
        let params = {};
        params.name = 'voice_memo';
        params.path = memoFilePath;
        // TODO: get current user profil
        params.author = '';
        params.lifetime = deletionDate;
        console.log('copy file: ' + filePath + ' to new path: ' + memoFilePath);
        Helpers.copyFile({
          oldPath: filePath,
          newPath: memoFilePath,
        })
        .then(() => {
          console.log('created voice memo file');
          return memoCtrl.addMemo(params)
        })
        .then((memo) => {
          console.log('saved voice memo entry in db: ' + JSON.stringify(memo));
          return Helpers.removeFile({path: filePath,})
        })
        .then(() => {
          console.log('removed old audio file');
          resolve();
        });
      });
  }

// Play a voice memo
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

// Play a certain voice memo
exports.playVoiceMemoFeedback = function() {
  // Return new Promise
  return new Promise((resolve, reject) => {
      Helpers.removeFile({path: filePath,})
      .then(() => {
        return memoCtrl.getMemoByName()
      })
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
// Delete all voice memos
exports.deleteAllMemos = (params) => {
    // Return new Promise
    return new Promise((resolve, reject) => {
      memoCtrl.getAllMemos()
      .then((memos) => {
          console.log('FOUND MEMOS:' + JSON.stringify(memos, null, 4));
          memos.forEach((memo) => {
              console.log('one memo of list: ' + JSON.stringify(memo, null, 4));
              Helpers.removeFile({path: memo.path,})
              .then((msg) => {
                console.log('deleted memo file of: ' + memo._id);
                return memoCtrl.deleteMemoById(memo._id)
              });
            })
        })
      .then(() => {
            return Helpers.removeFile({path: filePath,})
          });
    });
  };

// Delete a voice memo
exports.deleteVoiceMemo = function() {
    // Return new Promise
    return new Promise((resolve, reject) => {
          memoCtrl.getRandomVoiceMemo()
          .then((memo) => {
            // Delete voice memo file
            return Helpers.removeFile({path: memo.path,})
          })
          .then(() => {
            // Delete voice memo entry
            return memoCtrl.deleteMemoById(memo._id);
          })
          .then((msg) => {
              resolve(msg);
            });
        });
  };

// Delete recording file
exports.deleteRecording = function() {
    // Return new Promise
    return new Promise((resolve, reject) => {

      Helpers.removeFile({path: filePath,})
      .then(() => {
        resolve();
      });
    });
  };