'use strict';

var System = require('./../models/system');
var os = require('os');
var disk = require('diskspace');
var exec = require('child_process').exec;

exports.os = function() {
  return new Promise((resolve, reject) => {

    try {
      var params = {};
      params.cpu = os.cpus();
      params.load = os.loadavg();
      params.memory = {
        used: ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2),
        total: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
      };
      params.percentage = {
        used: (params.memory.used / params.memory.total).toFixed(2) * 100,
        free: 100 - (params.memory.used / params.memory.total).toFixed(2) * 100
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

    if (dir.startsWith('/')) {
      dir = '/';
    } else {
      dir = dir.slice(0,2);
    }

    disk.check(dir, (err, total, free, status) => {
      if (err) {
        reject(err);
      }

      let params = {}
      params.num = {
        total: (total / 1024 / 1024 / 1024).toFixed(2),
        used: ((total - free) / 1024 / 1024 / 1024).toFixed(2),
      };
      params.percentage = {
        used: (params.num.used / params.num.total).toFixed(2) * 100,
        free: 100 - (params.num.used / params.num.total).toFixed(2) * 100,
      };

      resolve(params);
    });
  });
};

exports.temp = () => {
  return new Promise((resolve, reject) => {

    let child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (err, stdout, stderr) {

      if (err !== null) {
        console.log(err);
        resolve({temp: false});
        // reject(err);
      } else {
        resolve({temp: parseFloat(stdout)/1000});
      }
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