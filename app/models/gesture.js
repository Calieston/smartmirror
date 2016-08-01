'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gestureSchema = new Schema({
  gesture: {
    type: String
  },
  widget: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gesture', gestureSchema);