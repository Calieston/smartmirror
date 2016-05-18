var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe("Webview Guide Check", function() {

  it("Guide Page can be viewed", function(done) {
    chai.request('http://localhost:3000/guide')
    .get('/')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });

});