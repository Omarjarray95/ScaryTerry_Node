'use strict';

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../app'); // Our app

describe('API endpoint /motivation', function () {
    this.timeout(10000); // How long to wait for a response (ms)
    before(function () {

    });

    after(function () {
    });

    // GET - first test
    it('should return objects that each contain numbers', function () {
        return chai.request(app)
            .get('/motivation/getmotivationStats/5c926640db149e155096dfa9')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.result1).to.be.an('number');

            });

    });
    /*
      // GET - Invalid path
      it('should return Not Found', function() {
        return chai.request(app)
          .get('/INVALID_PATH')
          .then(function(res) {
            throw new Error('Path exists!');
          })
          .catch(function(err) {
            expect(err).to.have.status(404);
          });
      });
    
      // POST - Add new color
      it('should add new color', function() {
        return chai.request(app)
          .post('/colors')
          .send({
            color: 'YELLOW'
          })
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body.results).to.be.an('array').that.includes(
              'YELLOW');
          });
      });
    
      // POST - Bad Request
      it('should return Bad Request', function() {
        return chai.request(app)
          .post('/colors')
          .type('form')
          .send({
            color: 'YELLOW'
          })
          .then(function(res) {
            throw new Error('Invalid content type!');
          })
          .catch(function(err) {
            expect(err).to.have.status(400);
          });
      });*/
});