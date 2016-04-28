var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Widget = require('./widgets');

var userSchema = new Schema({
  name:  String,
  bdate: Date,
  auth: {
    rfid: String,
    password: String
  },
  widgets: [
    {
      type: Schema.ObjectId,
      ref: 'Widget'
    }
  ],
  theme: String,
  active: Boolean,
  lastLogin: Date
});

module.exports = mongoose.model('User', userSchema);