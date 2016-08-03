'use strict';

var Memo = require('../models/memo');
var ObjectID = require('mongodb').ObjectID;

// Create Memo
exports.addMemo = (params) => {
  // Create new memo instance and insert data
  var newMemo = Memo({
    name: params.name,
    path: params.path,
    author: params.author,
    lifetime: params.lifetime,
  });

  /* Query Promise */
  return newMemo.save();
};

// Return a memo by memo name
exports.getMemoByName = (params) => {

  let query = Memo.find({name: params.name})
  .lean();

  return query.exec();

};