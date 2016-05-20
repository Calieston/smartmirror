var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});

var Users = require('./../../app/models/users');

describe('DB Users Check', function() {

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  it("Data can be saved", function(done) {
    new Users({
      firstname:  'Max',
      lastname:  'Mustermann',
      username:  'mmustermann',
      mail:  'max.mustermann@smartmirror.com',
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

  it("Data can be queried", function(done) {

    new new Users({
      firstname:  'Felix',
      lastname:  'Bauer',
      username:  'fbauer',
      mail:  'felix.bauer@smartmirror.com',
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
      firstname:  'Heike',
      lastname:  'Thomann',
      username:  'hthomann',
      mail:  'heike.thomann@smartmirror.com',
      bdate: 'Fri Sep 18 2011 19:05:17 GMT+0900 (JST)',
      auth: {
        rfid: 'c456',
        password: 'c456'
      },
      widgets: [],
      theme: 'Dark',
      active: true,
      lastLogin: 'Fri Sep 13 2011 19:05:17 GMT+0900 (JST)'
      }).save((err, model) => {
        if (err) return done(err);

        Users.find({}, (err, users) => {
          if (err) return done(err);

          users.forEach((user) => {

            expect(user).to.have.property('firstname')
            .that.is.a('string');
            expect(user).to.have.property('lastname')
            .that.is.a('string');
            expect(user).to.have.property('username')
            .that.is.a('string');
            expect(user).to.have.property('mail')
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
});