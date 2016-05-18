var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var host = 'http://localhost:3000';

describe("User Controller Check", function() {

  it("Open new user form", function(done) {
    chai.request(host)
      .get('/users/new')
      .end((err, res) => {
        expect(res).to.have.status(200)
          .to.be.html;
        done();
      });
  });

  it("Add a new user", function(done) {
    chai.request(host)
      .post('/users/new')
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

  it("Update a user", function(done) {
    chai.request(host)
      .get('/users')
      .end(function(err, res) {
        chai.request(host)
          .post('/users/' + res.body[0]._id + '/edit')
          .send({
            username: 'updatedUsername',
            bdate: 'Fri Sep 19 1992 12:05:17 GMT+0900 (JST)',
            theme: 'Light',
            active: 'true'
          })
          .end(function(error, response) {
            expect(response)
              .to.have.status(200)
              .to.be.html;
            done();
          })
      })
  });

  it("Delete a user", function(done) {
    chai.request(host)
      .get('/users')
      .end(function(err, res) {
        chai.request(host)
          .get('/users/' + res.body[0]._id + '/delete')
          .end(function(err, res) {
            done();
          })
      })
  });

});