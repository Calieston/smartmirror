'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Widget = require('./widgets');

var userSchema = new Schema({
  username: {
    type: String
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  mail: {
    type: String
  },
  bdate: {
    type: Date
  },
  auth: {
    rfid: {
      type: String
    },
    password: {
      type: String
    }
  },
  widgets: [{
    type: Schema.ObjectId,
    ref: 'Widget'
  }],
  theme: {
    type: String
  },
  active: {
    type: Boolean
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);