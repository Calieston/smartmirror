var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var widgetSchema = new Schema({
  name: String,
  position: {
    x: Number,
    y: Number
  },
  size: {
    x: Number,
    y: Number
  },
  settings: Mixed
});

module.exports = mongoose.model('Widget', widgetSchema);