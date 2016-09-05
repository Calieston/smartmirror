'use strict';

const exec = require('child_process').exec;

const sht31Script = 'python /home/pi/sensor_tests/sht31/sht31.py';

exports.sht31 = function(params) {
  // Return new Promise
  return new Promise((resolve, reject) => {
    exec(sht31Script, (err, stdout, stderr) => {
      if (err !== null) {
        reject(new Error('Nope'));
      } else {
        if (jsonIsValid(stdout)) {
          resolve(JSON.parse(stdout));
        }else {
          var response = JSON.stringify({
            temp: '-',
            humidity: '-',
          });
          resolve(response);
        }
      }
    });
  });
};

function jsonIsValid(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}