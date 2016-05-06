var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sensor = require('./sensors');

var systemSchema = new Schema({
  wifi: {
    ssid: {
      type: String
    },
    mac: {
      type: String
    },
    security: [ {
        type: String
      }
    ],
    password: {
      type: String
    }
  },
  sensors: [
    {
      type: Schema.ObjectId,
      ref: 'Sensor'
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('System', systemSchema);