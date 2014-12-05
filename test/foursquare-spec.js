'use strict';

describe('Strategy: Foursquare', function() {

  var foursquare = require('../src').Foursquare;

  it('should throw error if no client_id', function() {
    expect(foursquare.bind(this, {
      client_secret: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Foursquare Strategy with client_id');
  });

  it('should throw error if no client_secret', function() {
    expect(foursquare.bind(this, {
      client_id: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Foursquare Strategy with client_secret');
  });

  it('should throw error if no callback_url', function() {
    expect(foursquare.bind(this, {
      client_id: 'fooId',
      client_secret: 'fooSecret'
    })).toThrow('Must supply Foursquare Strategy with callback_url');
  });

  it('should set Foursquare', function() {
    var auth = foursquare({
      client_id: 'fooId',
      client_secret: 'fooSecret',
      callback_url: 'http://foo.com'
    });
    expect(auth.client_id).toEqual('fooId');
    expect(auth.client_secret).toEqual('fooSecret');
    expect(auth.callback_url).toEqual('http://foo.com');
  });

});
