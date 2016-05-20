var mongoose = require('mongoose');

var dummySchema = new mongoose.Schema({a:Number});

module.exports = mongoose.model('Dummy', dummySchema);