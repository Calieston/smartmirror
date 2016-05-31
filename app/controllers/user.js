'use strict';

var User = require('../models/users');

// Create User
exports.addUser = (params) => {

  // Create new user instance and insert data
  var newUser = User({
    username: params.name,
    bdate: params.bdate,
    theme: params.theme,
    active: (params.active == 'true' ? true : false),
  });

  /* Query Promise */
  return newUser.save();
};


// Retrieve all users from database
exports.getUsers = () => {
  let query = User.find({})
    .lean();

  return query.exec();
};

// Delete a user by id
exports.deleteUserById = (params) => {

  /* Query for deleting a user by id */
  let query = User.findByIdAndRemove(params.id);

  /* Query Promise */
  return query.exec();

};

// Return a user by id
exports.getUserById = (params) => {

  let query = User.findById(params.id);

  return query.exec();

};

// Update a user
exports.updateUser = (params) => {

  let query = User.findByIdAndUpdate(params.id, {
    username: params.name,
    bdate: params.bdate,
    theme: params.theme,
    active: params.active,
  }, {
    new: true,
  });

  return query.exec();
};