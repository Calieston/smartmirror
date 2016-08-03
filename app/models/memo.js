'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memoSchema = new Schema({
  name: {
    type: String
  },
  path: {
    type: String
  },
  author: {
    type: String,
  },
  lifetime: {
    type: Date
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Memo', memoSchema);