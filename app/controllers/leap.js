var leapjs = require('leapjs');
var recorder = require('./record.js').recorder;

var config = require('./../config');

const audioFileName = config.fileName;
const recordGesture= config.recordGesture;
const language = config.language;

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
          // start recording
          console.log('start recording');
          recorder.start()

          // TODO: Erst nachdem Recording abgeschlossen ist, parsen!

          // parse recorded wav file
          var google_speech = require('google-speech');

          google_speech.ASR({
              developer_key: 'AIzaSyDlEDsLuMljAMnvo-2INfm9Ru7bbICBWo4',
              file: audioFileName,
              lang: language
            }, function(err, httpResponse, json){
              if(err){
                  console.log(err);
                }else{
                  console.log(httpResponse.statusCode, json)
                }
              }
          );
        }
        break;

    }
  }
});
exports.leap = leap;