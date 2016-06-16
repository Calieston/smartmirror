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
  status: {
    type: String
  },
  settings: {}
}, {
  timestamps: true
});

module.exports = mongoose.model('Widget', widgetSchema);