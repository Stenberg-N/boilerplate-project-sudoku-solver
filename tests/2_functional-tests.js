const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  test("Test POST request to /api/solve with valid puzzle string", function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isString(res.body, 'response should be a string');

        assert.equal(res.body, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');

        done();
      });
  });

  test("Test POST request to /api/solve with a missing puzzle string", function(done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'required field missing' });

        done();
      });
  });

  test("Test POST request to /api/solve with a puzzle string of incorrect length", function(done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.3.7.2.12'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'puzzle string should be 81 characters long' });

        done();
      });
  });

  test("Test POST request to /api/solve with a puzzle string containing invalid characters", function(done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16ABCD926914.37.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'puzzle string contains invalid characters' });

        done();
      });
  });

  test("Test POST request to /api/solve with an invalid puzzle string", function(done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.akjjsh'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'puzzle string contains invalid characters and is not 81 characters long' });

        done();
      });
  });

  test("Test POST request to /api/solve with an unsolvable puzzle string", function(done) {
    // an eight is added to the first row, which already has an eight.
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: '185..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'puzzle cannot be solved' });

        done();
      });
  });

  test("Test POST request to /api/check with all fields to check puzzle placement", function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A2',
        value: 3
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { valid: true });

        done();
      });
  });

  test("Test POST request to /api/check for row conflict", function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A2',
        value: 4
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { conflict: ["row"], valid: false });

        done();
      });
  });

  test("Test POST request to /api/check for multiple conflicts", function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A2',
        value: 5
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { conflict: ["row", "region"], valid: false });

        done();
      });
  });

  test("Test POST request to /api/check for all conflicts", function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A2',
        value: 2
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { conflict: ["row", "column", "region"], valid: false });

        done();
      });
  });

  test("Test POST request to /api/check with missing required fields", function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        value: 2
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'missing required fields' });

        done();
      });
  });

  test("Test POST request to /api/check with invalid value 1", function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A2',
        value: 10
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'invalid value' });

        done();
      });
  });

  test("Test POST request to /api/check with invalid value 2", function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A2',
        value: 'C'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'invalid value' });

        done();
      });
  });

  test("Test POST request to /api/check with invalid coordinate 1", function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A10',
        value: 3
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'invalid coordinate' });

        done();
      });
  });

  test("Test POST request to /api/check with invalid coordinate 2", function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'J2',
        value: 3
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.deepEqual(res.body, { error: 'invalid coordinate' });

        done();
      });
  });

});

