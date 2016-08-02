'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gestureSchema = new Schema({
  gestureType: {
    type: String
  },
  widget: {
    type: String
  },
  assigned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gesture', gestureSchema);