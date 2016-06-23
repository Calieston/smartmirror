'use strict';

var System = require('./../models/system');
var os = require('os');
var disk = require('diskspace');

exports.os = function() {
  return new Promise((resolve, reject) => {

    try {
      var params = {};
      params.cpu = os.cpus();
      params.load = os.loadavg();
      params.memory = {
        free: os.freemem(),
        total: os.totalmem(),
      };
      params.uptime = os.uptime();

      resolve(params);
    }
    catch (err) {
      reject(err);
    }
  });
};

exports.disk = function() {
  return new Promise((resolve, reject) => {

    var dir = __dirname;

    if (dir.startsWith('/')) {
      dir = '/';
    } else {
      dir = dir.slice(0,2);
    }

    disk.check(dir, (err, total, free, status) => {
      if (err) {
        reject(err);
      }
      resolve({
        total: total,
        free: free,
      });
    });
  });
};

exports.get = function() {
  let query = System.findOne({})
    .lean();

  return query.exec();
};

exports.insert = function(params) {
  let query = new System({params});

  return query.save();
};

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

exports.updateUser = function(params) {
  console.log(params);

  let query = System.findOneAndUpdate({},{
    defaultUser: params.user
  }, {
    new: true,
  });

  return query.exec();
}