var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});

var Sensor = require('./../../app/models/sensors');

describe('DB Sensor Check', function () {

  beforeEach(function (done) {
    if (mongoose.connection.db) return done();

      mongoose.connect(dbURI, done);
  });

  it("Data can be saved", function(done) {
    new Sensor({
      address: '77',
      connection: 'i2c',
      name: 'temperature'
    }).save(done);
  });

  it("Data can be queried", function(done) {
    new Sensor({
      address: '66',
      connection: 'i2c',
      name: 'humidity'
    }).save(function(err, model){
      if (err) return done(err);

      new Sensor({
      address: '55',
      connection: 'i2c',
      name: 'light'
    }).save(function(err, model){
        if (err) return done(err);

        Sensor.find({}, function(err, sensors){
          if (err) return done(err);

          expect(sensors).to.have.length(3);

          sensors.forEach(function(sensor) {
            expect(sensor).to.have.property('address')
              .that.is.a('string')
              .that.match(/[0-9a-f]{2}/i);
            expect(sensor).to.have.property('connection')
              .that.is.a('string')
              .that.is.oneOf(['i2c', 'gpio', 'usb']);
            expect(sensor).to.have.property('name')
              .that.is.a('string');
          });

          done();
        });
      });
    });
  });

  it("DB can be cleared", function(done) {
    new new Sensor({
      address: '44',
      connection: 'i2c',
      name: 'move'
    }).save(function(err, model){
      if (err) return done(err);

      clearDB(function(err){
        if (err) return done(err);

        Sensor.find({}, function(err, sensors){
          if (err) return done(err);

          expect(sensors).to.have.length(0);
          done();
        });
      });
    });
  });
});