var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sensorSchema = new Schema({
  address: String,
  connection: String,
  name: String
});

module.exports = mongoose.model('Sensor', sensorSchema);