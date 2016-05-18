'use strict';

var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe("Webview Smartmirror Check", function() {

  it("displays smartmirror page", function(done) {
    chai.request('http://localhost:3000/smartmirror')
    .get('/')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    });
  });

  it('displays users specific webview', function (done) {
    let userid = '1234567890-abcdefghijklnopqrstuvwxyz';
    chai.request('http://localhost:3000/smartmirror/' + userid)
    .get('/')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200)
      .and.to.be.html;
      done();
    });
  });
});