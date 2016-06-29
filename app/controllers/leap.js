var leapjs = require('leapjs');
var config = require('./../config');
var google_speech = require('google-speech');
var fs = require('fs');
var filePath =  audioFileName || 'audio.wav';

const audioFileName = config.fileName;
const recordGesture= config.recordGesture;
const language = config.language;
const key = config.googleSpeechApiKey;

var leap  = new leapjs.Controller({enableGestures: true});
leap.on('connect', function() {
  console.log('leap motion successfully connected.');
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
          console.log('start recording');
          recorder.start()

          // TODO: Erst nachdem Recording abgeschlossen ist, parsen!

          // parse recorded wav file
          google_speech.ASR({
              developer_key: key || 'undefined',
              file: audioFileName || 'audio.wav',
              lang: language || 'de-DE'
            }, function(err, httpResponse, json){
              if(err){
                  console.log(err);
                }else{
                  console.log(httpResponse.statusCode, json)

                  // delete audio file after speech to text process
                  fs.unlinkSync(filePath);

                }
              }
          );
        }
        break;

    }
  }
});
exports.leap = leap;