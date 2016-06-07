'use strict';

var System = require('./../models/system');
var os = require('os');
var disk = require('diskusage');

exports.os = function() {
  return new Promise((resolve, reject) => {

    try {
      var params = {};
      params.cpu = os.cpus();
      params.load = os.loadavg();
      params.memory = {
        free: os.freemem(),
        total: os.totalmem(),
      }
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

    if(dir.startsWith('/')) {
      var dir = '/';
    } else {
      var dir = dir.slice(0,2);
    }

    disk.check(dir, function(err, data) {
      if(err) {
        reject(err);
      }
      resolve(data);
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