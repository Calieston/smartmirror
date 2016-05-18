'use strict';

var User = require('../models/users');

// Create User
exports.createUser = function(req, res) {
  // Create new user instance and insert data
  var newUser = User({
    username: req.body.name,
    bdate: req.body.bdate,
    theme: req.body.theme,
    active: (req.body.active == 'true' ? true : false),
  });
  /* Save new user */
  let query = newUser.save();
  /* Query Promise */
  query.then((user) => {
      res.redirect('/');
    })
    /* Catch Error */
    .catch((err) => {
      console.error(err);
      res.redirect('/?error=newUser');
    });
};

// Render view to create a new user
exports.getUserCreateForm = function(req, res) {
  res.render('user', {
    title: 'SmartMirror Backend Add User Profile',
  });

};

// Retrieve all users from database
exports.getUsers = function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
};

// Delete a user by id
exports.deleteUserById = function(req, res) {

  /* Query for deleting a user by id */
  let query = User.findByIdAndRemove(req.params.user).exec();

  /* Query Promise */
  query.then(() => {
      res.redirect('/?msg=userdeleted');
    })
    /* Catch Error */
    .catch((err) => {
      res.redirect('/?error=delete');
    });
};

// Return a user by id
exports.getUserById = function(req, res) {
  User.findById(req.params.id, function(err, user) {

    if (err) {
      res.json({
        error: err,
      });
    } else {
      if (user) {
        res.render('user_detail', {
          title: 'SmartMirror Backend Add User Profile',
          user: user,
        });
      } else {
        res.json({
          error: 'Wrong ID',
        });
      }
    }

  });
};

// Update a user
exports.updateUser = function(req, res) {
  User.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    bdate: req.body.bdate,
    theme: req.body.theme,
    active: req.body.active,
  }, {
    new: true,
  }, function(err, user) {

    if (err) {
      res.json(err);
    } else {
      if (user) {
        res.render('user_detail', {
          title: 'SmartMirror Backend Add User Profile',
          user: user,
        });
      } else {
        res.json({message: 'Wrong ID'});
      }
    }

  });
};