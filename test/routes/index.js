var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe("Webview Backend Check", function() {

  it("Backend Landing Page can be viewed", function(done) {
    chai.request('http://localhost:3000/')
    .get('/')
    .end(function(err, res) {
      done();  // <= Call done to signal callback end
    });
  });

  it("System Config Page can be viewed", function(done) {
    chai.request('http://localhost:3000/system')
    .get('/')
    .end(function(err, res) {
      done();  // <= Call done to signal callback end
    });
  });

  it("User Details Page can be viewed", function(done) {
    chai.request('http://localhost:3000/users/Roman')
    .get('/')
    .end(function(err, res) {
      done();  // <= Call done to signal callback end
    });
  });
});
