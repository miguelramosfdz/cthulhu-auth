'use strict';

describe('Strategy: Facebook', function() {

  var facebook;

  beforeEach(function() {
    facebook = require('../src').Facebook;
  });

  afterEach(function() {

  });

  it('should throw error if no app_id', function() {
    expect(facebook.bind(this, {
      app_secret: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Facebook with app_id');
  });

  it('should throw error if no app_secret', function() {
    expect(facebook.bind(this, {
      app_id: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Facebook with app_secret');
  });

  it('should throw error if no callback_url', function() {
    expect(facebook.bind(this, {
      app_id: 'fooId',
      app_secret: 'fooSecret'
    })).toThrow('Must supply Facebook with callback_url');
  });

  it('should set Facebook', function() {
    var auth = facebook({
      app_id: 'fooId',
      app_secret: 'fooSecret',
      callback_url: 'http://foo.com'
    });
    expect(auth.app_id).toEqual('fooId');
    expect(auth.app_secret).toEqual('fooSecret');
    expect(auth.callback_url).toEqual('http://foo.com');
  });

});
