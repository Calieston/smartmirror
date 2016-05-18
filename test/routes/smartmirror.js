var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe("Webview Smartmirror Check", function() {

  it("Smartmirror Page can be viewed", function(done) {
    chai.request('http://localhost:3000/smartmirror')
    .get('/')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });
});