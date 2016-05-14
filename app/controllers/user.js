'use strict';

var User = require('../models/users');

// Create User
// REQ JSON: username, password, mail
// RES JSON: user / error
exports.createUser = function(req, res) {
		console.log('call controller method');
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
	}
	// Create User
	// REQ JSON: username, password, mail
	// RES JSON: user / error
exports.getUsers = function(req, res) {
    res.render('user', {
      title: 'SmartMirror Backend Add User Profile',
    });

}