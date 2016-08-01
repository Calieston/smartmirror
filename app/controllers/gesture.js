'use strict';

var Gesture = require('../models/gesture');
var ObjectID = require('mongodb').ObjectID;

// TODO: route to initialize system with possible gestures

// Create Gesture
exports.addGesture = (params) => {
  // Create new gesture instance and insert data
  var newGesture = Gesture({
    gesture: params.gesture,
    widget: params.widget,
  });
  console.log(newGesture);

  /* Query Promise */
  return newGesture.save();
};


// Retrieve all gestures from database
exports.getGestures = () => {
  let query = Gesture.find({})
  .lean();
  return query.exec();
};

// Delete a gesture by id
exports.deleteGestureById = (params) => {

  /* Query for deleting a gesture by id */
  let query = Gesture.findByIdAndRemove(params.id);

  /* Query Promise */
  return query.exec();

};

// Return a gesture by id
exports.getGestureById = (params) => {
  console.log('call gesturebyid'+params.id);
  let query = Gesture.findById(params.id)
  .lean();
  console.log(query.exec());
  return query.exec();

};

// Return a gesture by gesture name
exports.getGestureByName = (params) => {

  let query = Gesture.find({gesture: params.username})
  .lean();

  return query.exec();

};

// Update existing gesture
exports.updateGesture = (params) => {
  console.log('call update method');
 let query = Gesture.findByIdAndUpdate(params.id, {
    gesture: params.gesture,
    widget: params.widget
  }, {
    new: true,
  })
  .lean();

  return query.exec();
};