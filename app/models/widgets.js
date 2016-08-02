'use strict';

var mongoose = require('mongoose');
var path = require('path');
var Schema = mongoose.Schema;

var Module = require('./modules');
var Gesture = require('./gesture');

var widgetSchema = new Schema({
  module: {
    type: Schema.ObjectId,
    ref: 'Module'
  },
  name: {
    type: String
  },
  status: {
    type: String
  },
  gesture: {
    type: Schema.ObjectId,
    ref: 'Gesture'
  },
  settings: {},
  size: {
    type: String
  },
  gestureSupport: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Widget', widgetSchema);