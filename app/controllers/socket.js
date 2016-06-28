'use strict';

var socketIO = require('socket.io');
var io = socketIO();

io.on('connection', function (socket) {
  socket.emit('test', {msg: 'Message from Server' });
  socket.on('clientTest', function (data) {
    console.log(data);
  });
});

exports.reload = () => {
	io.emit('reload');
}

exports.io = io;