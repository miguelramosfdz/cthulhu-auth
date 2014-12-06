'use strict';

describe('Strategy: Twitter', function() {

  var auth;
  var twitter = require('../src').TwitterStrategy;

  beforeEach(function() {
    auth = twitter({
      consumer_key: 'fooId',
      consumer_secret: 'fooSecret',
      callback_url: 'http://foo.com'
    });
  });

  it('should throw error if no client_id', function() {
    expect(twitter.bind(this, {
      consumer_secret: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Twitter Strategy with consumer_key');
  });

  it('should throw error if no client_secret', function() {
    expect(twitter.bind(this, {
      consumer_key: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Twitter Strategy with consumer_secret');
  });

  it('should throw error if no callback_url', function() {
    expect(twitter.bind(this, {
      consumer_key: 'fooId',
      consumer_secret: 'fooSecret'
    })).toThrow('Must supply Twitter Strategy with callback_url');
  });

  describe('strategy', function() {
    it('should have request_token_url', function() {
      expect(auth.request_token_url).not.toEqual(undefined);
    });
    it('should have access_token_url', function() {
      expect(auth.access_token_url).not.toEqual(undefined);
    });
    it('should have profile_url', function() {
      expect(auth.profile_url).not.toEqual(undefined);
    });
    it('should have authorize_url', function() {
      expect(auth.authorize_url).not.toEqual(undefined);
    });
    it('should have client_id', function() {
      expect(auth.consumer_key).toEqual('fooId');
    });
    it('should have client_secret', function() {
      expect(auth.consumer_secret).toEqual('fooSecret');
    });
    it('should have callback_url', function() {
      expect(auth.callback_url).toEqual('http://foo.com');
    });
  });

});
