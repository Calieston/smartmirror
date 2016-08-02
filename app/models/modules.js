'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moduleSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['error','installed', 'installing']
  },
  homepage: {
    type: String
  },
  version: {
    type: String
  },
  size: [
    {
      type: String,
      enum: ['2x2', '4x2', '4x4']
    }
  ],
  gestureSupport: {
    type: Boolean
  },
  settings: {}
}, {
  timestamps: true
});


module.exports = mongoose.model('Module', moduleSchema);