'use strict';

var User = require('./../models/users');

exports.get = function(userid) {
  let query = User.findById(userid);
      query.populate('widgets');

  query.exec()

  return query;
}