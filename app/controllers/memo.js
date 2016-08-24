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

// Get a random voice memo
exports.getRandomVoiceMemo = () => {
  let query = Memo.findOne()
    .lean();

  return query.exec();
};

// Delete a memo by id
exports.deleteMemoById = (params) => {

  /* Query for deleting a user by id */
  let query = Memo.findByIdAndRemove(params.id);

  /* Query Promise */
  return query.exec();

};

