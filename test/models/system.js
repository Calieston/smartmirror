var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});

var System = require('./../../app/models/system');

describe('DB System Check', function() {

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  it("Data can be saved", function(done) {
    new System({
      wifi: {
        ssid: 'ACLCICHCGC',
        mac: '6c:b0:ce:44:e9:1e',
        security: [
        'WPA',
        'WPA2'
        ],
        password: '1234'
      },
      sensors: []
    }).save(done);
  });

  it("Data can be queried", function(done) {

    System.findOne({}, (err, system) => {
      if (err) return done(err);

      expect(system).to.have.property('wifi')
      .that.is.a('object');
      expect(system).to.have.property('wifi')
      .that.has.property('ssid')
      .that.is.a('string');
      expect(system).to.have.property('wifi')
      .that.has.property('mac')
      .that.is.a('string')
      .that.match(/^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/);
      expect(system).to.have.property('wifi')
      .that.has.property('security')
      .that.is.a('array')
      .that.is.not.empty;
      expect(system).to.have.property('sensors')
      .that.is.a('array');

      done();
    });

  });

  it("DB can be cleared", function(done) {

    clearDB((err) => {
      if (err) return done(err);

      System.find({}, (err, system) => {
        if (err) return done(err);

        expect(system).to.have.length(0);
        done();
      });
    });
  });
});