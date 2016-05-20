var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');

var Dummy = require('./dummyModel');

describe("DB Check", function() {

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbURI, done);
  });

  it("Data can be saved", function(done) {
    new Dummy({a: 1}).save(done);
  });

  it("Data can be queried", function(done) {
    new Dummy({a: 1}).save((err, model) => {
      if (err) return done(err);

      new Dummy({a: 2}).save((err, model) => {
        if (err) return done(err);

        Dummy.find({}, (err, docs) => {
          if (err) return done(err);

          expect(docs).to.have.length(3);
          done();
        });
      });
    });
  });
});