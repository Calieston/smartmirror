var mic = require('mic');
var fs = require('fs');
var config = require('./../config');
var path = require('path');
const audioFileName = path.join(__dirname, './../../samples/' + config.fileName);
var recorder;

exports.record = function() {
  return new Promise((resolve, reject) => {
    recorder = mic({
        rate: '16000',
        channels: '1',
        debug: false,
      });

    var micInputStream = recorder.getAudioStream();

    var fileName = audioFileName || 'audio.wav';
    var outputFileStream = fs.WriteStream(fileName);

    micInputStream.pipe(outputFileStream);

    micInputStream.on('startComplete', function() {
        console.log('recording started');
        setTimeout(function() {
            recorder.stop();
            console.log('recording stop');
            resolve(audioFileName);
          }, 5000);
      });
    recorder.start();
  });
}

exports.recorder = recorder;