var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe("Webview Guide Check", () => {

  it("Guide Page can be viewed", (done) => {
    chai.request('http://localhost:3000')
    .get('/')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });
});