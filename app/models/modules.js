var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moduleSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  details: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['error','installed', 'installing']
  },
  url: {
    type: String
  },
  version: {
    type: String
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Module', moduleSchema);