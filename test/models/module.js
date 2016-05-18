var dbURI = 'mongodb://localhost/smartmirror-test';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var clearDB = require('mocha-mongoose')(dbURI, {noClear: true});

var Module = require('./../../app/models/modules');

describe("DB Module Check", function() {

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  it("Data can be saved", function(done) {
    new Module({
      author: 'Ein Name',
      description: 'Lorem ipsum Anim Ut non tempor Duis nulla ea id nulla labore ex.',
      details: 'www.eine_andere_url.com',
      name: 'ModuleNo1',
      url: 'www.urltogit.de',
      status: 'installing',
      version: '0.1'
    }).save(done);
  });

  it("Data can be queried", function(done) {
    new Module({
      author: 'Ein Name',
      description: 'Lorem ipsum Anim Ut non tempor Duis nulla ea id nulla labore ex.',
      details: 'www.eine_andere_url.com',
      name: 'ModuleNo1',
      url: 'www.urltogit.de',
      status: 'installing',
      version: '0.1'
    }).save((err, model) => {
      if (err) return done(err);

      new Module({
        author: 'Ein Name',
        description: 'Lorem ipsum Anim Ut non tempor Duis nulla ea id nulla labore ex.',
        details: 'www.eine_andere_url.com',
        name: 'ModuleNo1',
        url: 'www.urltogit.de',
        status: 'installing',
        version: '0.1'
      }).save((err, model) => {
        if (err) return done(err);

        Module.find({}, (err, modules) => {
          if (err) return done(err);

          expect(modules).to.have.length(3);

          modules.forEach((module) => {
            expect(module).to.have.property('author')
              .that.is.a('string');
            expect(module).to.have.property('createdAt')
              .that.is.a('date');
            expect(module).to.have.property('description')
              .that.is.a('string');
            expect(module).to.have.property('details')
              .that.is.a('string');
            expect(module).to.have.property('name')
              .that.is.a('string');
            expect(module).to.have.property('url')
              .that.is.a('string')
              .that.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
            expect(module).to.have.property('updatedAt')
              .that.is.a('date');
            expect(module).to.have.property('status')
              .that.is.a('String')
              .that.is.oneOf(['defect','installed', 'installing']);
            expect(module).to.have.property('version')
              .that.is.a('string');
          });

          done();
        });
      });
    });
  });

  it("Data can be updated", function (done) {
    Module.findOne({}, (err, module) => {

      if (err) return done(err);

      var temp = JSON.parse(JSON.stringify(module));

      module.author = 'Ein anderer Name';

      setTimeout( function () {

        module.save((err, module) => {
          if (err) return done(err);

          expect(module).to.have.property('author')
            .that.is.a('string')
            .that.is.not.equal(temp.author);
          expect(module).to.have.property('createdAt')
            .that.is.a('date')
            .that.is.not.equal(temp.createdAt);

          done();
        });

      }, 1100);

    });

  });

  it("DB can be cleared", function(done) {
    new Module({
      author: 'Ein Name',
      description: 'Lorem ipsum Anim Ut non tempor Duis nulla ea id nulla labore ex.',
      details: 'www.eine_andere_url.com',
      name: 'ModuleNo1',
      url: 'www.urltogit.de',
      status: 'installing',
      version: '0.1'
    }).save((err, model) => {
      if (err) return done(err);

      clearDB((err) => {
        if (err) return done(err);

        Module.find({}, (err, modules) => {
          if (err) return done(err);

          expect(modules).to.have.length(0);
          done();
        });
      });
    });
  });
});