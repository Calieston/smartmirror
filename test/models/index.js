var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Dummy = mongoose.model('Dummy', new mongoose.Schema({a:Number}));
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});

describe("DB Check", function() {

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbURI, done);
  });

  it("Data can be saved", function(done) {
    new Dummy({a: 1}).save(done);
  });

  it("Data can be queried", function(done) {
    new Dummy({a: 1}).save(function(err, model){
      if (err) return done(err);

      new Dummy({a: 2}).save(function(err, model){
        if (err) return done(err);

        Dummy.find({}, function(err, docs){
          if (err) return done(err);

          expect(docs).to.have.length(3);
          done();
        });
      });
    });
  });

  it("DB can be cleared", function(done) {
    new Dummy({a: 5}).save(function(err, model){
      if (err) return done(err);

      clearDB(function(err){
        if (err) return done(err);

        Dummy.find({}, function(err, docs){
          if (err) return done(err);

          expect(docs).to.have.length(0);
          done();
        });
      });
    });
  });
});