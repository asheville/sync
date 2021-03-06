require('park-ranger')();

var assertFunctionCallbacksError = require('app/lib/assertions/functionCallbacksError'),
  assertFunctionCallbacksResult = require('app/lib/assertions/functionCallbacksResult'),
  getResource = require('app/controllers/item/getResource'),
  mongoose = require('app/lib/mongoose'),
  nock = require('app/lib/nock'),
  wh = require('app/lib/warehouse');

describe('itemController getResource method', function() {
  beforeEach(mongoose.removeAllCollections);

  assertFunctionCallbacksError(getResource, [{
    when: 'no url parameter provided',
    params: [undefined],
    error: 'Parameter url undefined or null'
  }, {
    when: 'url parameter not string',
    params: [3],
    error: 'Parameter url is not a string'
  }, {
    when: 'url parameter not a valid URL',
    params: ['asdf'],
    error: 'Parameter url is not a properly formatted string'
  }, {
    when: 'url parameter has unsupported extension',
    params: ['http://example.com/foo.xyz'],
    error: 'Parameter url indicates unsupported media type'
  }, {
    when: 'url parameter indicates non-existent resource',
    params: [wh.jsonUrl],
    error: 'Failed to make successful request. HTTP status code: 404',
    before: function(done) {
      nock.get(wh.jsonUrl, wh.jsonData(), 404);
      done();
    }
  }, {
    when: 'provided url without authorization',
    params: [wh.jsonUrl],
    error: 'Failed to make successful request. HTTP status code: 401',
    before: function(done) {
      nock.get(wh.jsonUrl, wh.jsonData(), 401);
      done();
    }
  }]);

  assertFunctionCallbacksResult(getResource, [{
    when: 'provided valid url for json file and callback',
    params: [wh.jsonUrl],
    result: wh.jsonData(),
    before: function(done) {
      nock.get(wh.jsonUrl,  wh.jsonData());
      done();
    }
  }, {
    when: 'provided valid url for jpeg file and callback',
    params: [wh.jpegUrl],
    result: wh.jpegData,
    before: function(done) {
      nock.get(wh.jpegUrl, wh.jpegData);
      done();
    }
  }]);
});
