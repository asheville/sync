var db = require('../db');
var wh = require('../warehouse');
var assert = require('assert');
var async = require('async');
var Storage = require('../../models/storage');
var StorageFactory = require('../factory')('storage');
var UserStorageAuthFactory = require('../factory')('userStorageAuth');

describe('new storage', function() {
  before(db.clear);
  
  before(function(done) {
    this.storage = wh.storage;
    this.userStorageAuth = wh.userStorageAuth;

    wh.userStorageAuth.save(function(error) {
      done();
    });
  });

  it('has id', function() {
    assert.equal(this.storage.id, wh.swh.storage.attributes.id);
  });

  it('has host', function() {
    assert.equal(this.storage.host, wh.swh.storage.attributes.host);
  });

  it('returns expected path with subPath and userStorageAuth', function() {
    assert.equal(this.storage.path('foo', this.userStorageAuth), '/foo?access_token=' + wh.swh.userStorageAuth.attributes.storageToken);
  });

  it('throws error instead of returning path when subPath undefined', function(done) {
    try {
      this.storage.path(undefined, this.userStorageAuth);
      done(new Error('Error not thrown by method'));
    } catch (error) {
      assert.equal(error.message, 'Parameter subPath undefined or null');
      done();
    }
  });

  it('throws error instead of returning path when subPath not string', function(done) {
    try {
      this.storage.path(3, this.userStorageAuth);
      done(new Error('Error not thrown by method'));
    } catch (error) {
      assert.equal(error.message, 'Parameter subPath not string');
      done();
    }
  });

  it('throws error instead of returning path when userStorageAuth undefined', function(done) {
    try {
      this.storage.path('foo');
      done(new Error('Error not thrown by method'));
    } catch (error) {
      assert.equal(error.message, 'Parameter userStorageAuth undefined or null');
      done();
    }
  });

  it('throws error instead of returning path when userStorageAuth.storageToken undefined', function(done) {
    try {
      this.storage.path('foo', { foo: 'bar' });
      done(new Error('Error not thrown by method'));
    } catch (error) {
      assert.equal(error.message, 'Parameter userStorageAuth has no storageToken property');
      done();
    }
  });

  it('throws error if attributes undefined upon creation', function(done) {
    try {
      new Storage(null);
    } catch (error) {
      assert.equal(error.message, 'Parameter attributes undefined or null');
      done();
    }
  });

  it('throws error if attributes.id undefined upon creation', function(done) {
    try {
      new Storage({ host: wh.swh.storage.attributes.host });
    } catch (error) {
      assert.equal(error.message, 'Parameter attributes has no id property');
      done();
    }
  });

  it('throws error if attributes.id not string upon creation', function(done) {
    try {
      new Storage({ id: 3, host: wh.swh.storage.attributes.host });
    } catch (error) {
      assert.equal(error.message, 'Property id of attributes not a string');
      done();
    }
  });

  it('throws error if attributes.host undefined upon creation', function(done) {
    try {
      new Storage({ id: wh.swh.storage.attributes.id });
    } catch (error) {
      assert.equal(error.message, 'Parameter attributes has no host property');
      done();
    }
  });

  it('throws error if attributes.host not string upon creation', function(done) {
    try {
      new Storage({ id: wh.swh.storage.attributes.id, host: 3 });
    } catch (error) {
      assert.equal(error.message, 'Property host of attributes not a string');
      done();
    }
  });

  it('throws error if attributes.path defined and not function upon creation', function(done) {
    try {
      new Storage({
        id: wh.swh.storage.attributes.id,
        host: wh.swh.storage.attributes.host,
        path: 315
      });
    } catch (error) {
      assert.equal(error.message, 'Property path of attributes not a function');
      done();
    }
  });

  it('returns expected path when attributes.path defined on creation', function(done) {
    var self = this;

    var storage = new Storage({
      id: wh.swh.storage.attributes.id, 
      host: wh.swh.storage.attributes.host,
      path: function(path, userStorageAuth) {
        return '/now' + path + '?token=' + userStorageAuth.storageToken;
      }
    });

    try {
      assert.equal(storage.path('/this/is/a/path', self.userStorageAuth), '/now/this/is/a/path?token=' + wh.swh.userStorageAuth.attributes.storageToken);
      done();
    } catch (error) {
      done(error);
    }
  });
});