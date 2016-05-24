'use strict';

var mongoose = require('mongoose');
var path = require('path');
var Schema = mongoose.Schema;

var Module = require('./modules');

var widgetSchema = new Schema({
  module: {
    type: Schema.ObjectId,
    ref: 'Module'
  },
  name: {
    type: String
  },
  position: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String
  },
  size: {
    x: {
      type: Number,
      default: 1
    },
    y: {
      type: Number,
      default: 1
    }
  },
  settings: {}
}, {
  timestamps: true
});

module.exports = mongoose.model('Widget', widgetSchema);