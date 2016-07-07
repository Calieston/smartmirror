var request = require('request');
var fs = require('fs');
var config = require('./../config');
var path = require('path');
var socketCtrl = require('./socket');

const key = config.googleSpeechApiKey;
const file = config.fileName;
const lang = config.language;
var url_start = 'https://www.google.com/speech-api/v2/recognize?key=' + key;
var url_end = '&lang=' + lang + '&output=json';
var filePath = path.join(__dirname, './../../samples/' + file);


// parse audio file
exports.speechToText = function() {
  return new Promise((resolve, reject) => {

    // parse audio file after finished recording
    setTimeout(function() {
      try {
        // check if file is available
        fs.accessSync(filePath, fs.F_OK);
        fs.readFile(filePath, function(err, data) {
          if (err) {
            reject(err);
          }
          var r = request.post({
            url: url_start + url_end,
            headers: {
              'Content-Type': 'audio/l16; rate=16000;',
            },
            body: data
          }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
              if (error) {
                reject(error);
              }
              // ignore first empty response
              var body = body.split('\n')[1];
              // check if response exists
              var response = 'empty';
              if (body.indexOf('result') > -1) {
                // parse to JSON
                var jObj = JSON.parse(body);
                response = jObj.result['0'].alternative['0'].transcript;
              }
              //fs.unlinkSync(filePath);
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