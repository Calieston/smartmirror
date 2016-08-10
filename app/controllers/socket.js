'use strict';

var socketIO = require('socket.io');
var speech = require('./speech');
var userCtrl = require('./user');
var config = require('./../config');
const recordGesture = config.recordGesture;
var io = socketIO();
var natural = require('natural');

io.on('connection', function(socket) {
  console.log('connection');
  socket.emit('test', {
    msg: 'Message from Server',
  });
  socket.on('clientTest', function(data) {
    console.log(data);
  });
  socket.on('smartmirror', function(data) {
    switch (data.msg) {
      case 'record': {
        console.log('start recording');
        io.emit('recording', {
          status: 'enabled',
        });
        speech.speechToText().then((response) => {
          io.emit('recording', {
            status: 'disabled',
          });
          if (response != 'empty') {
            let probabilityRate = 0.8;
            if (natural.JaroWinklerDistance(response, 'Profil') > probabilityRate) {
              loadUserProfile(response);
            } else
            if (natural.JaroWinklerDistance(response, 'Notiz') > probabilityRate) {
              speech.createVoiceMemo(response)
              .then((response) => {
                io.emit('voiceMemo', {
                  status: 'create',
                });
              });
            } else
            if (natural.JaroWinklerDistance(response, 'Nachrichten') > probabilityRate) {
              speech.playVoiceMemo(response)
              .then((response) => {
                io.emit('voiceMemo', {
                  status: 'play',
                });
              });
            } else
            if (natural.JaroWinklerDistance(response, 'Löschen') > probabilityRate) {
              speech.deleteVoiceMemo(response)
              .then((response) => {
                io.emit('voiceMemo', {
                  status: 'deleted',
                });
              });
            }
          } else {
            console.log('speech to text: no result')
          }
        });
        break;
      }
      case 'tagesschau': {
        io.emit('tagesschau');
        break;
      }
      case 'display off': {
        // TODO
        break;
      }
      case 'display on': {
        // TODO
        break;
      }
    }
  });
});

function loadUserProfile(response) {
  userCtrl.getUserByName({
      username: response,
    })
    .then((user) => {
      // Load user profile if user was found
      if (user['0']) {
        console.log('load user profile of ' + user['0'].username);
        io.emit('loadUser', {
          user: user['0']._id,
        });
      } else {
        console.log('user \"' + response + '\" was not found in database');
      }
    })
}
exports.reload = () => {
  io.emit('reload');
};

exports.loadUser = (params) => {
  io.emit('loadUser', {
    user: params.user,
  });
}

exports.io = io;