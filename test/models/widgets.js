var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});

var Widget = require('./../../app/models/widgets');

describe("DB Widget Check", function() {

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  it("Data can be saved", function(done) {
    new Widget({
      name: 'Widget1',
      position: {
        x: 1,
        y: 1
      },
      size: {
        x: 1,
        y: 1
      },
      settings: {}
    }).save(done);
  });

  it("Data can be queried", function(done) {
    new Widget({
      name: 'Widget2',
      position: {
        x: 2,
        y: 2
      },
      size: {
        x: 2,
        y: 2
      },
      settings: {}
    }).save((err, model) => {
      if (err) return done(err);

      new Widget({
      name: 'Widget3',
      position: {
        x: 3,
        y: 3
      },
      size: {
        x: 3,
        y: 3
      },
      settings: {}
    }).save((err, model) => {
        if (err) return done(err);

        Widget.find({}, (err, widgets) => {
          if (err) return done(err);

          expect(widgets).to.have.length(3);

          widgets.forEach((widget) => {
            expect(widget).to.have.property('name')
              .that.is.a('string');
            expect(widget).to.have.property('position')
              .that.is.a('object')
              .that.has.property('x')
              .that.is.a('number')
              .that.is.below(17);
            expect(widget).to.have.property('position')
              .that.is.a('object')
              .that.has.property('x')
              .that.is.a('number')
              .that.is.below(10);
            expect(widget).to.have.property('settings')
              .that.exists;
          });

          done();
        });
      });
    });
  });

  it("DB can be cleared", function(done) {
    new Widget({
      name: 'Widget4',
      position: {
        x: 4,
        y: 4
      },
      size: {
        x: 4,
        y: 4
      },
      settings: {}
    }).save((err, model) => {
      if (err) return done(err);

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
});