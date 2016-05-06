var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe("Webview Backend Check", function() {

  it("Backend Landing Page can be viewed", function(done) {
    chai.request('http://localhost:3000')
    .get('/')
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  it("System Config Page can be viewed", function(done) {
    chai.request('http://localhost:3000/system')
    .get('/')
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });

  it("User Details Page can be viewed", function(done) {
    chai.request('http://localhost:3000/users/Roman')
    .get('/')
    .end(function(err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});
