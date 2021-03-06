require('park-ranger')();

var app = require('app'),
  assert = require('assert'),
  supertest = require('supertest');

describe('GET /', function() {
  it('responds with jsonapi object', function(done) {
    supertest(app).get('/').end(function(error, res) {
      assert(JSON.parse(res.text).jsonapi);
      done();
    });
  });
});

describe('GET /jobs', function() {
  describe('returns job resource objects related to request user', function() {
    it('sorted by createdAt desc by default');
    it('sortable by createdAt asc');
    it('sortable by id asc and desc');
    it('sortable by updatedAt asc and desc');
    it('not sortable by other attribute');
    it('limited to 25 objects per page by default');
    it('limitable by other objects count');
    it('pageable by cursor');
  });

  it('returns no job resource objects related to other users');
  it('returns job resource objects related to request user and other users when request user is admin');
  it('includes jsonapi object');
  it('includes 200 status code');
});
