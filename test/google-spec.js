'use strict';

describe('Strategy: Google', function() {

  var google;

  beforeEach(function() {
    google = require('../src').Google;
  });

  afterEach(function() {
    google = undefined;
  });

  it('should throw error if no client_id', function() {
    expect(google.bind(this, {
      app_secret: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Google Strategy with client_id');
  });

  it('should throw error if no client_secret', function() {
    expect(google.bind(this, {
      client_id: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Google Strategy with client_secret');
  });

  it('should throw error if no redirect_uri', function() {
    expect(google.bind(this, {
      client_id: 'fooId',
      client_secret: 'fooSecret'
    })).toThrow('Must supply Google Strategy with redirect_uri');
  });

  it('should set Google', function() {
    var auth = google({
      client_id: 'fooId',
      client_secret: 'fooSecret',
      redirect_uri: 'http://foo.com'
    });
    expect(auth.client_id).toEqual('fooId');
    expect(auth.client_secret).toEqual('fooSecret');
    expect(auth.redirect_uri).toEqual('http://foo.com');
  });

});
