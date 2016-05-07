var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Dummy = mongoose.model('Dummy', new mongoose.Schema({a:Number}));
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});

describe("DB Check", () => {

  beforeEach((done) => {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbURI, done);
  });

  it("Data can be saved", (done) => {
    new Dummy({a: 1}).save(done);
  });

  it("Data can be queried", (done) => {
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

  it("DB can be cleared", (done) => {
    new Dummy({a: 5}).save((err, model) => {
      if (err) return done(err);

      clearDB((err) => {
        if (err) return done(err);

        Dummy.find({}, (err, docs) => {
          if (err) return done(err);

          expect(docs).to.have.length(0);
          done();
        });
      });
    });
  });
});