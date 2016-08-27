'use strict';

var Memo = require('../models/memo');
var ObjectID = require('mongodb').ObjectID;
var Helpers = require('./helpers');

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

// Return all memos
exports.getAllMemos = (params) => {

  let query = Memo.find({})
  .lean();

  return query.exec();

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

// Delete old voice memos
exports.deleteOldMemos = (params) => {
  var now = new Date();
  var del;
  let query = Memo.find({})
    .lean();

  query.then((memos) => {
    memos.forEach((memo) => {
      del = calculateDateDiff(now, memo.lifetime);
      if (del) {
        Helpers.removeFile({path: memo.path,})
        .then((msg) => {
          let deleteQuery = Memo.findByIdAndRemove(memo._id);
          return deleteQuery.exec();
        });
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
  return query;
};

// Calculate date diff between two dates
function calculateDateDiff(date1, date2) {
  var del = false;
  // Convert both dates to milliseconds
  var date1Ms = date1.getTime()
  var date2Ms = date2.getTime()

  // Calculate the difference in seconds
  var diffInSeconds = date2Ms - date1Ms
  if (diffInSeconds >= 0) {
    del = true;
  }
  return del;
}