'use strict';

var Widget = require('../models/widgets');
var Client = require('node-rest-client').Client;

// Get weather for default location
exports.getWeather = function(req, res) {
  var client = new Client();
  var city = req.query.city;
  if (typeof city == 'undefined') {
    city = 'Stuttgart';
  }
  // Api call to fetch weather data
  client.get('http://api.openweathermap.org/data/2.5/weather?q='
    + city + '&lang=de&units=metric&APPID=384c499db848052e6aeed5df1388d5e7',
   function(data, response) {
    // Convert in json
    JSON.stringify(data);

    /* Map json response to widget module */
    let widget = new Widget({
      name: data.name,
      status: data.weather['0'].description,
      temperature: Math.round(data.main.temp),
    });
    res.send(widget);
  });
};

