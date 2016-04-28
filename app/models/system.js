var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sensor = require('./sensors');

var systemSchema = new Schema({
  wifi: {
    ssid: String,
    mac: String,
    security: [ String ],
    password: String
  },
  sensors: [
    {
      type: Schema.ObjectId,
      ref: 'Sensor'
    }
  ]
});

module.exports = mongoose.model('System', systemSchema);