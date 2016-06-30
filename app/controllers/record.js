var mic = require('mic');
var fs = require('fs');
var config = require('./../config');
const audioFileName = config.fileName;

var recorder = mic({
    'rate': '16000',
    'channels': '1',
    'debug': false
});
var micInputStream = recorder.getAudioStream();

var fileName = audioFileName || 'audio.wav';
var outputFileStream = fs.WriteStream(fileName);

micInputStream.pipe(outputFileStream);

micInputStream.on('startComplete', function() {
    setTimeout(function() {
        recorder.stop();
        console.log('recording stop');
    }, 5000);
});

exports.recorder = recorder;