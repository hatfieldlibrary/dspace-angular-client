var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var config = require('../config/environment');


chai.use(chaiHttp);


describe('dspace test', function () {

  // it('should return JSON describing a community', function (done) {
  //   chai.request(server)
  //     .get('http://158.104.3.30:8080/xmlui/handle/123456789/1')
  //     .end(function (err, res) {
  //         res.should.have.status(200);
  //         done();
  //       });
  //
  //
  // });


  it('should return login status', function (done) {
    chai.request(server)
      .get('/ds-api/login/mspalti')
      .set('User-Agent', 'Request-Promise')

      .end(function (err, res) {
        res.should.have.status(401);

         done();
      })
      .catch(function (err) {
        throw err;
      });
  });

});
// describe('handle request', function() {
//   it('should return JSON describing a community', function(done) {
//     chai.request(server)
//       .get('/handle/10177/13')
//       .then(function (res) {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.have.property('name');
//        // res.body.name.should.equal('Department of Classical Studies');
//         res.body.should.have.property('id');
//       //  res.body.id.should.equal(89);
//         done();
//       })
//       .catch(function (err) {
//         throw err;
//       })
//   });
//
//   it('should return JSON describing a collection', function(done) {
//     chai.request(server)
//       .get('/handle/10177/238')
//       .then(function (res) {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.have.property('name');
//        // res.body.name.should.equal('Classical Studies Faculty Publications');
//         res.body.should.have.property('id');
//       //  res.body.id.should.equal(118);
//         done();
//       })
//       .catch(function (err) {
//         throw err;
//       })
//   });
//
//   it('should return JSON describing an item', function(done) {
//     chai.request(server)
//       .get('/handle/10177/1059')
//       .then(function (res) {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.have.property('name');
//        // res.body.name.should.equal('Hurro-Hittite Narrative Song as a Bilingual Oral-Derived Genre');
//         res.body.should.have.property('id');
//       //  res.body.id.should.equal(6100);
//         done();
//       })
//       .catch(function (err) {
//         throw err;
//       })
//   });
//
//   // Testing solr from a development machine requires port forwarding!
//   it('should return query result', function(done) {
//     chai.request(server)
//       .get('/solr/divine')
//       .then(function (res) {
//         res.should.have.status(200);
//         res.should.be.json;
//         done();
//       })
//       .catch(function (err) {
//         throw err;
//       })
//   });
//});
