'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Modules = require('./modules');

var widgetSchema = new Schema({
  module: {
    type: Schema.ObjectId,
    ref: 'Modules'
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