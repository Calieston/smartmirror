'use strict';

var socketIO = require('socket.io');
var recorder = require('./record').recorder;
var config = require('./../config');
var google_speech = require('google-speech');
var fs = require('fs');

const audioFileName = config.fileName;
const recordGesture = config.recordGesture;
const language = config.language;
const key = config.googleSpeechApiKey;
var filePath = audioFileName || 'audio.wav';
var io = socketIO();

io.on('connection', function(socket) {
  socket.emit('test', {
    msg: 'Message from Server'
  });
  socket.on('clientTest', function(data) {
    console.log(data);
  });
  socket.on('smartmirror', function(data) {
    console.log('Get message from leap client');
    if (data == 'swipe') {
      recorder.start()
        // send audio file to google speech api
      setTimeout(function() {
        // parse recorded wav file
        google_speech.ASR({
          developer_key: key || 'undefined',
          file: audioFileName || 'audio.wav',
          lang: language || 'de-DE'
        }, function(err, httpResponse, json) {
          if (err) {
            console.log(err);
          } else {
            var username = json.result['0'].alternative['0'].transcript
            console.log(username);
            //socketCtrl.loadUser({user: username});

            // delete audio file after parsing process
            fs.unlinkSync(filePath);

          }
        });
      }, 5000)
    }

  });
});


exports.reload = () => {
  io.emit('reload');
};

exports.loadUser = (params) => {
  console.log('call user load method');
  io.emit('loadUser', {
    user: params.user
  });
}

exports.io = io;