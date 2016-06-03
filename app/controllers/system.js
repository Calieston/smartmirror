'use strict';

var System = require('./../models/system');

exports.get = function() {
  let query = System.findOne({})
    .lean();

  return query.exec();
};

exports.insert = function(params) {
  let query = new System({params});

  return query.save();
}

exports.update = function(params) {
  let query = System.findOneAndUpdate({},{
    wifi: {
      ssid: params.ssid,
      mac: params.mac,
      security: params.security,
      password: params.password,
    },
  }, {
    new: true,
  });

  return query.exec()
  .then((system) => {
    if (system === null) {
      let newSystem = new System({
        wifi: {
          ssid: params.ssid,
          mac: params.mac,
          security: params.security,
          password: params.password,
        },
      });
      return newSystem.save();
    }
    return system;
  });
};