var mic = require('mic');
var fs = require('fs');
var config = require('./../config');
const audioFileName = config.fileName;

var recorder = mic({
    'rate': '16000',
    'channels': '1',
    'debug': true,
    'exitOnSilence': 6
});
var micInputStream = recorder.getAudioStream();

var outputFileStream = fs.WriteStream(audioFileName);

micInputStream.pipe(outputFileStream);

micInputStream.on('data', function(data) {
    console.log("Recieved Input Stream: " + data.length);
});

micInputStream.on('error', function(err) {
    cosole.log("Error in Input Stream: " + err);
});

micInputStream.on('startComplete', function() {
    console.log("Got SIGNAL startComplete");
    setTimeout(function() {
        recorder.pause();
    }, 5000);
});

micInputStream.on('stopComplete', function() {
    console.log("Got SIGNAL stopComplete");
});

micInputStream.on('pauseComplete', function() {
    console.log("Got SIGNAL pauseComplete");
    setTimeout(function() {
        recorder.resume();
    }, 5000);
});

micInputStream.on('resumeComplete', function() {
    console.log("Got SIGNAL resumeComplete");
    setTimeout(function() {
        recorder.stop();
    }, 5000);
});

micInputStream.on('silence', function() {
    console.log("Got SIGNAL silence");
});

micInputStream.on('processExitComplete', function() {
    console.log("Got SIGNAL processExitComplete");
});

exports.recorder = recorder;