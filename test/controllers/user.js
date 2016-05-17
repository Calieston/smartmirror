var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var host = 'http://localhost:3000';

describe("User Controller Check", () => {

  it("New user form can be viewed", (done) => {
    chai.request(host)
    .get('/users')
    .end((err, res) => {
      expect(res).to.have.status(200)
      .to.be.html;
      done();
    });
  });

  it("New User can be added", (done) => {
    chai.request(host)
    .post('/users')
    .send({
      username: 'testuser',
      bdate: 'Fri Sep 19 1992 12:05:17 GMT+0900 (JST)',
      theme: 'Light',
      active: 'true'
      })
    .end((err, res) => {
      expect(res).to.have.status(200)
      .to.be.html;
      done();
    });
  });
});