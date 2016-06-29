var leapjs = require('leapjs');

var leap  = new leapjs.Controller({enableGestures: true});
leap.on('connect', function() {
  console.log("leap motion successfully connected.");
});
leap.on('deviceFrame', function(frame) {
  // loop through available gestures
  for (var i = 0; i < frame.gestures.length; i++) {
    var gesture = frame.gestures[i];
    switch (gesture.type) {

      case "swipe":
        if (gesture.state == "stop") {
          console.log('start recording');
        }
        break;

    }
  }
});
exports.leap=leap;