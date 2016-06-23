'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sensor = require('./sensors');
var User = require('./users');

var systemSchema = new Schema({
  wifi: {
    ssid: {
      type: String
    },
    mac: {
      type: String
    },
    security: [ {
        type: String
      }
    ],
    password: {
      type: String
    }
  },
  sensors: [
    {
      type: Schema.ObjectId,
      ref: 'Sensor'
    }
  ],
  defaultUser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('System', systemSchema);