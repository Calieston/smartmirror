'use strict';

var mongoose = require('mongoose');
var path = require('path');
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
  temperature: {
    type: String
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

widgetSchema.virtual('path').get(function() {
  return __dirname + './../modules/' + this.name + '/view.jade';
})

module.exports = mongoose.model('Widget', widgetSchema);