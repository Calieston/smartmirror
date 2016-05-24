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
      type: Number
    },
    y: {
      type: Number
    }
  },
  status: {
    type: String
  },
  size: {
    x: {
      type: Number
    },
    y: {
      type: Number
    }
  },
  settings: {}
}, {
  timestamps: true
});

module.exports = mongoose.model('Widget', widgetSchema);