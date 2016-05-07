var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});

var Users = require('./../../app/models/users');

describe('DB Users Check', () => {

  beforeEach((done) => {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  it("Data can be saved", (done) => {
    new Users({
      name:  'Max',
      bdate: 'Fri Sep 16 2011 19:05:17 GMT+0900 (JST)',
      auth: {
        rfid: 'a123',
        password: 'a123'
      },
      widgets: [],
      theme: 'Dark',
      active: true,
      lastLogin: 'Fri Sep 15 2011 19:05:17 GMT+0900 (JST)'
    }).save(done);
  });

  it("Data can be queried", (done) => {

    new new Users({
      name:  'Hans',
      bdate: 'Fri Sep 17 2011 19:05:17 GMT+0900 (JST)',
      auth: {
        rfid: 'b234',
        password: 'b234'
      },
      widgets: [],
      theme: 'Dark',
      active: true,
      lastLogin: 'Fri Sep 14 2011 19:05:17 GMT+0900 (JST)'
    }).save((err, model) => {
      if (err) return done(err);

      new Users({
        name:  'Heike',
        bdate: 'Fri Sep 18 2011 19:05:17 GMT+0900 (JST)',
        auth: {
          rfid: 'c345',
          password: 'c345'
        },
        widgets: [],
        theme: 'Dark',
        active: false,
        lastLogin: 'Fri Sep 13 2011 19:05:17 GMT+0900 (JST)'
      }).save((err, model) => {
        if (err) return done(err);

        Users.find({}, (err, users) => {
          if (err) return done(err);

          users.forEach((user) => {

            expect(user).to.have.property('name')
            .that.is.a('string');
            expect(user).to.have.property('bdate')
            .that.is.a('date');
            expect(user).to.have.property('auth')
            .that.is.a('object')
            .that.is.not.empty;
            expect(user).to.have.property('widgets')
            .that.is.a('array');
            expect(user).to.have.property('theme')
            .that.is.a('string');
            expect(user).to.have.property('active')
            .that.is.a('boolean');
            expect(user).to.have.property('lastLogin')
            .that.is.a('date');
          });

          done();
        });
      });
    });
  });


  it("DB can be cleared", (done) => {

    new Users({
      name:  'Heike',
      bdate: 'Fri Sep 18 2011 19:05:17 GMT+0900 (JST)',
      auth: {
        rfid: 'c345',
        password: 'c345'
      },
      widgets: [],
      theme: 'Dark',
      active: true,
      lastLogin: 'Fri Sep 13 2011 19:05:17 GMT+0900 (JST)'
    }).save((err, model) => {

      clearDB(function(err){
        if (err) return done(err);

        Users.find({}, function(err, user){
          if (err) return done(err);

          expect(user).to.have.length(0);
          done();
        });
      });
    });
  });
});