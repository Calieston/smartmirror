'use strict';

var Gesture = require('../models/gesture');
var ObjectID = require('mongodb').ObjectID;

var gestureTypes = ['none', 'swipe left', 'swipe right', 'swipe up', 'swipe down', 'circle clock', 'circle unclock'];

// Initialize all available gestures
exports.initialize = () => {
  Gesture.find({}, function(err, results){
    if(err){
      console.log('Error: '+ err);
    }
    // save initial gestures if collection is empty
    if(!results.length){
      gestureTypes.forEach(function(gestureType){
        var newGesture = Gesture({
          gestureType: gestureType
        });
        newGesture.save();
      });
    }
  })
}

// Create Gesture
exports.addGesture = (params) => {
  // Create new gesture instance and insert data
  var newGesture = Gesture({
    gestureType: params.gestureType,
  });

  /* Query Promise */
  return newGesture.save();
};


// Retrieve all gestures from database
exports.getGestures = () => {
  let query = Gesture.find({assigned: false})
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
  let query = Gesture.findById(params.id)
  .lean();
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
 let query = Gesture.findByIdAndUpdate(params.gestureId, {
    assigned: params.status
  }, {
    new: true,
  })
  .lean();

  return query.exec();
};