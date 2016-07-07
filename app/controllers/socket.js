'use strict';

var socketIO = require('socket.io');
var recorder = require('./record').recorder;
var speech = require('./speech');
var userCtrl = require('./user');
var config = require('./../config');
const recordGesture = config.recordGesture;
var io = socketIO();

io.on('connection', function(socket) {
  console.log('connection');
  socket.emit('test', {
    msg: 'Message from Server'
  });
  socket.on('clientTest', function(data) {
    console.log(data);
  });
  socket.on('smartmirror', function(data) {
    switch (data.msg) {
      case 'record':
        console.log('start recording');
        // recorder.start();
        speech.speechToText().then((response) => {
          if (response != 'empty') {
            userCtrl.getUserByName({
                username: response
              })
              .then((user) => {
                // load user profile if user was found
                if (user['0']) {
                  console.log('load user profile of '+ user['0'].username);
                  io.emit('loadUser', {
                    user: user['0']._id
                  });
                } else {
                  console.log('user \"'+ response + '\" was not found in database');
                }
              })
          } else {
            console.log('speech to text: no result')
          }

        });
        break;
      case 'tagesschau':
        io.emit('tagesschau');
        break;
      case 'display off':
        // TODO
        break;
      case 'display on':
        // TODO
        break;
    }
  });
});


exports.reload = () => {
  io.emit('reload');
};

exports.loadUser = (params) => {
  io.emit('loadUser', {
    user: params.user
  });
}

exports.io = io;