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
  settings: {}
}, {
  timestamps: true
});


module.exports = mongoose.model('Module', moduleSchema);