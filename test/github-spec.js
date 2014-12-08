'use strict';

describe('Strategy: Github', function() {

  var auth, res, query, end, send;
  var fakerequest = require('./fake-request');
  var request = fakerequest.request;
  var github = require('../src').GithubStrategy;

  beforeEach(function() {
    auth = github({
      client_id: 'fooId',
      client_secret: 'fooSecret',
      callback_url: 'http://foo.com'
    });
    res = {
      redirect: jasmine.createSpy('redirect')
    };
    send = fakerequest.send;
    query = fakerequest.query;
    end = fakerequest.end;
    spyOn(request, 'get').andReturn({
      query: query
    });
    spyOn(request, 'post').andReturn({
      send: send
    });
  });

  afterEach(function() {
    auth = undefined;
  });

  it('should throw error if no client_id', function() {
    expect(github.bind(this, {
      client_secret: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Github Strategy with client_id');
  });

  it('should throw error if no client_secret', function() {
    expect(github.bind(this, {
      client_id: 'fooId',
      callback_url: 'http://foo.com'
    })).toThrow('Must supply Github Strategy with client_secret');
  });

  it('should throw error if no callback_url', function() {
    expect(github.bind(this, {
      client_id: 'fooId',
      client_secret: 'fooSecret'
    })).toThrow('Must supply Github Strategy with callback_url');
  });

  describe('strategy', function() {
    it('should have authorizeUrl', function() {
      expect(auth.authorizeUrl).not.toEqual(undefined);
    });
    it('should have tokenUrl', function() {
      expect(auth.tokenUrl).not.toEqual(undefined);
    });
    it('should have profileUrl', function() {
      expect(auth.profileUrl).not.toEqual(undefined);
    });
    it('should have client_id', function() {
      expect(auth.client_id).toEqual('fooId');
    });
    it('should have client_secret', function() {
      expect(auth.client_secret).toEqual('fooSecret');
    });
    it('should have callback_url', function() {
      expect(auth.callback_url).toEqual('http://foo.com');
    });
  });

  describe('.callback()', function() {
    it('should send GET request with correct params', function() {
      auth.callback({ query: { code: '1234'} });
      expect(request.post).toHaveBeenCalledWith(auth.tokenUrl);
      expect(send).toHaveBeenCalledWith({
        client_id: 'fooId',
        redirect_uri: 'http://foo.com',
        client_secret: 'fooSecret',
        code: '1234'
      });
      expect(end).toHaveBeenCalled();
    });
  });

  describe('.onToken()', function() {
    it('should call next if error', function() {
      var next = jasmine.createSpy('next');
      auth.onToken(null, next, { error: true });
      expect(next).toHaveBeenCalledWith(true);
    });
    it('should get profile', function() {
      auth.onToken(null, null, { body: 'access_token=1234' });
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
      auth.onProfile('1234', req, next, {
        text: JSON.stringify({ user: 'user' })
      });
      expect(req.oauth).toEqual({
        provider: 'github',
        token: '1234',
        profile: { user: 'user' }
      });
      expect(next).toHaveBeenCalled();
    });
  });

});
