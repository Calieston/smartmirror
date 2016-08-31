'use strict';

var User = require('./../models/users');
var Widget = require('./../models/widgets');
var Module = require('./../models/modules');
var System = require('./../models/users');
var os = require('os');

exports.getConfig = () => {
  return new Promise((resolve, reject) => {
    let data = os.networkInterfaces();
    if (data !== null) {
      resolve(data);
    } else {
      reject(new Error());
    }
  });
};

exports.getUser = (params) => {
  let query = User.findById(params.id)
    .lean();

  return query.exec();
};

exports.getDefaultUser = () => {
  let query = System.findOne()
    .lean();

  return query.exec();
};

exports.getWidget = (params) => {
  let query = Widget.findById(params.id)
    .lean()
    .populate('module')
    .populate('gesture');

  return query.exec();
};