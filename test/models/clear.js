var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});

var Dummy = require('./dummyModel');
var System = require('./../../app/models/system');
var Module = require('./../../app/models/modules');
var Sensor = require('./../../app/models/sensors');
var Users = require('./../../app/models/users');
var Widget = require('./../../app/models/widgets');


describe('DB clear', function () {

  it("DB Dummy cleared", function(done) {
    clearDB((err) => {
      if (err) return done(err);
      Dummy.find({}, (err, docs) => {
        if (err) return done(err);
        expect(docs).to.have.length(0);
        done();
      });
    });
  });

  it("System DB cleared", function(done) {
    clearDB((err) => {
      if (err) return done(err);
      System.find({}, (err, system) => {
        if (err) return done(err);
        expect(system).to.have.length(0);
        done();
      });
    });
  });

  it("Module DB cleared", function(done) {
    clearDB((err) => {
      if (err) return done(err);
      Module.find({}, (err, modules) => {
        if (err) return done(err);
        expect(modules).to.have.length(0);
        done();
      });
    });
  });

  it("Sensor DB cleared", function(done) {
    clearDB((err) => {
      if (err) return done(err);
      Sensor.find({}, (err, sensors) => {
        if (err) return done(err);
        expect(sensors).to.have.length(0);
        done();
      });
    });
  });

  it("Users DB cleared", function(done) {
    clearDB(function(err){
      if (err) return done(err);
      Users.find({}, function(err, user){
        if (err) return done(err);
        expect(user).to.have.length(0);
        done();
      });
    });
  });

  it("Widget DB cleared", function(done) {
    clearDB((err) => {
      if (err) return done(err);
      Widget.find({}, (err, widgets) => {
        if (err) return done(err);
        expect(widgets).to.have.length(0);
        done();
      });
    });
  });

});