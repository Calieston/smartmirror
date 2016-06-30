var leapjs = require('leapjs');
var config = require('./../config');
var google_speech = require('google-speech');
var fs = require('fs');
var socketCtrl = require('./socket');

const audioFileName = config.fileName;
const recordGesture = config.recordGesture;
const language = config.language;
const key = config.googleSpeechApiKey;
var filePath = audioFileName || 'audio.wav';

var leap = new leapjs.Controller({
  enableGestures: true
});
leap.on('connect', function() {
  //console.log('leap motion successfully connected.');
});
leap.on('deviceFrame', function(frame) {
  // Loop through available gestures
  for (var i = 0; i < frame.gestures.length; i++) {
    var gesture = frame.gestures[i];
    switch (gesture.type) {

      case recordGesture:
        if (gesture.state == 'stop') {
          var recorder = require('./record.js').recorder;

          // start recording
          console.log('recording start');
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
          })
        }
        break;

    }
  }
});
exports.leap = leap;