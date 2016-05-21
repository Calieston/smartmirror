'use strict';

var User = require('./../models/users');
var Widget = require('./../models/widgets');
var Module = require('./../models/modules');

exports.getUser = (id) => {
  let query = User.findById(id)
    .lean()
    .populate('widgets');

  return query.exec();
};

exports.getWidget = (id) => {
  let query = Widget.findById(id)
    .lean()
    .populate('module');

  return query.exec();
};