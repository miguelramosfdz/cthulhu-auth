'use strict';

describe('Util: OAuth', function() {

  var twitter = require('../src').TwitterStrategy;

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

  it('should set Twitter', function() {
    var auth = twitter({
      consumer_key: 'fooId',
      consumer_secret: 'fooSecret',
      callback_url: 'http://foo.com'
    });
    expect(auth.consumer_key).toEqual('fooId');
    expect(auth.consumer_secret).toEqual('fooSecret');
    expect(auth.callback_url).toEqual('http://foo.com');
  });

});
