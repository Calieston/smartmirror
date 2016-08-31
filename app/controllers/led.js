'use strict';

const blinkstick = require('blinkstick');
const device = blinkstick.findFirst();

// Set to color
//  params: {
//    color: 'Red color intensity 0-255 OR string CSS color keyword OR hex color, eg "#BADA55".',
//    options: {
//      channel: 0 - Channel is represented as 0=R, 1=G, 2=B
//      index: 0 - The index of the LED
//    }.
//  }
exports.setColor = function(params) {

  return new Promise((resolve, reject) => {

    if (!device) {
      reject(new Error({status: error, msg: 'no device found'}));
    }

    device.setColor(params.color, params.options, () => {
      resolve({status: success});
    });

  });
}

// Morph color to color
// params: {
//   color: 'Red color intensity 0-255 OR string CSS color keyword OR hex color, eg "#BADA55".',
//   options: {
//     channel: 0 - Channel is represented as 0=R, 1=G, 2=B
//     index: 0 - The index of the LED
//     duration: 1000 - How long should the morph animation last in milliseconds
//     steps: 50 - How many steps for color changes
//   }
// }
exports.morph = function(params) {

  return new Promise((resolve, reject) => {

    if (!device) {
      reject(new Error({status: error, msg: 'no device found'}));
    }

    device.morph(params.color, params.options, () => {
      resolve({status: success});
    });

  });
}

// Blink
// params {
//   color: 'Red color intensity 0-255 OR string CSS color keyword OR hex color, eg "#BADA55".',
//   options: {
//     channel: 0 - Channel is represented as 0=R, 1=G, 2=B
//     index: 0 - The index of the LED
//     repeats: 1 - How many times to blink
//     delay: 1 - Delay between on/off cycles in milliseconds
//   }
// }
exports.blink = function(params) {

  return new Promise((resolve, reject) => {

    if (!device) {
      reject(new Error({status: error, msg: 'no device found'}));
    }

    device.blink(params.color, params.options, () => {
      resolve({status: success});
    });

  });
}