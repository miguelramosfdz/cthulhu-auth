'use strict';

describe('Strategy: Google', function() {

  var auth, res, query, data, end;
  var google = require('../src').GoogleStrategy;
  var fakerequest = require('./fake-request');
  var request = fakerequest.request;

  beforeEach(function() {
    auth = google({
      client_id: 'fooId',
      client_secret: 'fooSecret',
      redirect_uri: 'http://foo.com'
    });
    query = fakerequest.query;
    end = fakerequest.end;
    data = fakerequest.data;
    spyOn(request, 'get').andReturn({
      query: query
    });
    spyOn(request, 'post').andReturn({
      data: data
    });
  });

  afterEach(function() {
    auth = undefined;
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

  it('should set config', function() {
    expect(auth.client_id).toEqual('fooId');
    expect(auth.client_secret).toEqual('fooSecret');
    expect(auth.redirect_uri).toEqual('http://foo.com');
  });

  describe('.callback()', function() {
    it('should send GET request with correct params', function() {
      auth.callback({ query: { code: '1234'} });
      expect(request.post).toHaveBeenCalledWith(auth.tokenUrl);
      expect(data).toHaveBeenCalledWith({
        code: '1234',
        client_id: 'fooId',
        client_secret: 'fooSecret',
        redirect_uri: 'http://foo.com',
        grant_type: 'authorization_code'
      });
      expect(end).toHaveBeenCalled();
    });
  });

  describe('.onToken()', function() {
    it('should call next if error', function() {
      var next = jasmine.createSpy('next');
      auth.onToken(null, next, true, null, null);
      expect(next).toHaveBeenCalledWith(true);
    });
    it('should get profile', function() {
      auth.onToken(null, null, null, null, { access_token: '1234' });
      expect(request.get).toHaveBeenCalledWith(auth.profileUrl);
      expect(query).toHaveBeenCalledWith({
        access_token: '1234'
      });
      expect(end).toHaveBeenCalled();
    });
  });

  describe('.onProfile()', function() {
    it('should set req.oauth and call next', function() {
      var req = {};
      var next = jasmine.createSpy('next');
      auth.onProfile('1234', req, next, null, null, { user: 'user' });
      expect(req.oauth).toEqual({
        provider: 'google',
        token: '1234',
        profile: { user: 'user' }
      });
      expect(next).toHaveBeenCalled();
    });
  });

});
