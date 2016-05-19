var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var host = 'http://localhost:3000';

describe("Weather Controller Check", function() {

  it("Get default weather data", function(done) {
    chai.request(host)
      .get('/smartmirror/weather')
      .end((err, res) => {
        expect(res.body)
        .to.have.property('name')
        .that.is.a('string')
        expect(res.body)
        .to.have.property('status')
        .that.is.a('string')
        expect(res.body)
        .to.have.property('temperature')
        .that.is.a('string')
        expect(res)
          .to.have.status(200)
          .to.be.json;
        done();
      });
  });

  it("Get weather data for certain city", function(done) {
    chai.request(host)
      .get('/smartmirror/weather')
      .query({city:'Heilbronn'})
      .end((err, res) => {
        expect(res.body)
        .to.have.property('name')
        .that.is.a('string')
        .that.equals('Heilbronn');
        expect(res.body)
        .to.have.property('status')
        .that.is.a('string')
        expect(res.body)
        .to.have.property('temperature')
        .that.is.a('string')
        expect(res)
          .to.have.status(200)
          .to.be.json;
        done();
      });
  });
});