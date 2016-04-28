var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe("Webview Guide Check", function() {

  it("Guide Page can be viewed", function(done) {
    chai.request('http://localhost:3000/')
    .get('/')
    .end(function(err, res) {
      done();  // <= Call done to signal callback end
    });
  });
});