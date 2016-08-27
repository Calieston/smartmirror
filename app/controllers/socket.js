'use strict';

var socketIO = require('socket.io');
var speechCtrl = require('./speech');
var recorderCtrl = require('./record');
var userCtrl = require('./user');
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
    switch (data.action) {
      case 'record': {
        console.log('action: record');
        io.emit('recording', {
          status: 'enabled',
        });
        // Start recording
        recorderCtrl.record()
        .then((response) => {
          // Parse recording
          return speechCtrl.speechToText();
        })
        .then((response) => {
          console.log('Response speech to text: ' + JSON.stringify(response));
          io.emit('recording', {
            status: 'disabled',
          });
          // Check speech to text response
          if (response != 'empty') {
            let probabilityRate = 0.8;
            if (natural.JaroWinklerDistance(response, 'profil') > probabilityRate) {
              console.log('call load user profil function');
              var username = response.split('profil ')[1];
              speechCtrl.loadUserProfile(username)
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
                });
            } else
            if (natural.JaroWinklerDistance(response, 'notiz') > probabilityRate) {
              console.log('call sprach notiz function');
              speechCtrl.createVoiceMemo(response)
              .then((response) => {
                io.emit('voiceMemo', {
                  status: 'created',
                });
              });
            } else
            if (natural.JaroWinklerDistance(response, 'nachrichten abspielen') > probabilityRate) {
              console.log('call nachrichten abspielen function');
              speechCtrl.playVoiceMemo()
              .then((response) => {
                io.emit('voiceMemo', {
                  status: 'play',
                });
              });
            } else
            if (natural.JaroWinklerDistance(response, 'löschen') > probabilityRate) {
              console.log('call nachrichten löschen function');
              speechCtrl.deleteAllMemos(response)
              .then((response) => {
                io.emit('voiceMemo', {
                  status: 'all deleted',
                });
              });
            } else
            // Timer module
            if (natural.JaroWinklerDistance(response, 'timer') > probabilityRate) {
              console.log('call timer function');
              var timervalue = response.split('timer ')[1];
              var duration = timervalue.split(' minuten')[0];
              // Attention: currently only duration in minutes are possible!
              speechCtrl.deleteRecording()
              .then((msg) {
              io.emit('timer', {
                duration: duration,
              });
              });
            }
          } else {
            console.log('speech to text: no result')
            speechCtrl.deleteRecording();
          }
        });
        break;
      }
      case 'gesture': {
        console.log('action: gesture');
        // Send socket message to client
        io.emit(data.widget);
        break;
      }
    }
  });
});

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