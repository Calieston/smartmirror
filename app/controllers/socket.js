'use strict';

var socketIO = require('socket.io');
var speech = require('./speech');
var recorder = require('./record');
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
    console.log('DATA: ' + JSON.stringify(data));
    /*    Io.emit('tagesschau');*/
    switch (data.action) {
      case 'record': {
        socket.emit('recording', {
          status: 'enabled',
        });
        recorder.record()
        .then((response) => {
          return speech.speechToText();
        })
        .then((response) => {
          console.log('Response speech to text: ' + JSON.stringify(response));
          socket.emit('recording', {
            status: 'disabled',
          });

        if (response != 'empty') {
          let probabilityRate = 0.8;
          if (natural.JaroWinklerDistance(response, 'profil') > probabilityRate) {
            console.log('call load user profil function');
            loadUserProfile(response);
          } else
          if (natural.JaroWinklerDistance(response, 'notiz') > probabilityRate) {
            console.log('call load sprach notiz function');
            speech.createVoiceMemo(response)
            .then((response) => {
/*              io.emit('voiceMemo', {
                status: 'create',
              });*/
            });
          } else
          if (natural.JaroWinklerDistance(response, 'nachrichten') > probabilityRate) {
            console.log('call load nachrichten function');
            speech.playVoiceMemo();
            .then((response) => {
/*              io.emit('voiceMemo', {
                status: 'play',
              });*/
            });
          } else
          if (natural.JaroWinklerDistance(response, 'nachrichten löschen') > probabilityRate) {
            console.log('call load nachrichten löschen function');
            speech.deleteVoiceMemo(response)
            .then((response) => {
/*              io.emit('voiceMemo', {
                status: 'deleted',
              });*/
            });
          }
        } else {
          console.log('speech to text: no result')
        }
        });
        break;
      }
      case 'gesture': {
        console.log('go into case');
        io.emit('smartmirror-weather');
        break;
      }
    }
  });
});

// Load a user profile with a voice command
function loadUserProfile(response) {
  var username = response.split('profil ')[1];
  userCtrl.getUserByName({
      username: username,
    })
    .then((user) => {
      // Load user profile if user was found
      if (user['0']) {
        console.log('load user profile of ' + user['0'].username);
        io.emit('loadUser', {
          user: user['0']._id,
        });
      } else {
        console.log('user \"' + username + '\" was not found in database');
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

exports.transportGestures = (params) => {
  // Send user gesture widgets to leap client
  io.emit('gestures', {
    userGestureWidgets: params.userGestureWidgets,
  });
  return params;
}

exports.io = io;