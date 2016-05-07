var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var host = 'http://localhost:3000';

describe("Webview Backend Check", () => {

  it("Backend Landing Page can be viewed", (done) => {
    chai.request(host)
    .get('/')
    .end((err, res) => {
      expect(res).to.have.status(200)
      .to.be.html;
      done();
    });
  });

  it("System Config Page can be viewed", (done) => {
    chai.request(host)
    .get('/system')
    .end((err, res) => {
      expect(res).to.have.status(200)
      .to.be.html;
      done();
    });
  });

  it("Add User Page can be viewed", (done) => {
    chai.request(host)
    .get('/users')
    .end((err, res) => {
      expect(res).to.have.status(200)
      .to.be.html;
      done();
    });
  });

  /*Creates timeout error ?!?!*/
  /*it("Add User Page can be viewed", (done) => {
    chai.request(host)
    .post('/users')
    .field('name', 'Testname')
    .field('bdate', '2016-05-01')
    .field('theme', 'light')
    .field('active', 'true')
    .end((err, res) => {
      expect(res).to.have.status(304)
      .to.be.html;
      done();
    });
  });*/

  it("User Details Page can be viewed", (done) => {
    chai.request(host)
    .get('/users/Roman')
    .end((err, res) => {
      expect(res).to.have.status(200)
      .to.be.html;
      done();
    });
  });

});
