'use strict';

var Module = require('./../models/modules');

exports.getAll = function(params) {
  let query = Module.find({})
    .lean();

  return query.exec();
};