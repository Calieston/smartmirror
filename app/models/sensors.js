'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sensorSchema = new Schema({
  address: {
    type: String
  },
  connection: {
    type: String
  },
  name: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sensor', sensorSchema);