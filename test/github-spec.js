'use strict';

describe('Strategy: Github', function() {

  var auth, query, end, res;
  var request = require('superagent');
  var github = require('../src').Github;

  beforeEach(function() {
    auth = github({
      client_id: 'fooId',
      client_secret: 'fooSecret',
      callback_url: 'http://foo.com'
    });
    res = {
      redirect: jasmine.createSpy('redirect')
    };
    end = jasmine.createSpy('query');
    query = jasmine.createSpy('query').andReturn({
      end: end
    });
    spyOn(request, 'get').andReturn({
      query: query
    });
    spyOn(request, 'post').andReturn({
      query: query
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

  it('should set config', function() {
    expect(auth.client_id).toEqual('fooId');
    expect(auth.client_secret).toEqual('fooSecret');
    expect(auth.callback_url).toEqual('http://foo.com');
  });

  describe('.callback()', function() {
    it('should send GET request with correct params', function() {
      auth.callback({ query: { code: '1234'} });
      expect(request.post).toHaveBeenCalledWith(auth.tokenUrl);
      expect(query).toHaveBeenCalledWith({
        client_id: 'fooId',
        redirect_uri: 'http://foo.com',
        client_secret: 'fooSecret',
        code: '1234'
      });
      expect(end).toHaveBeenCalled();
    });
  });

  describe('.onCode()', function() {
    it('should call next if error', function() {
      var next = jasmine.createSpy('next');
      auth.onCode(null, next, true, null, null);
      expect(next).toHaveBeenCalledWith(true);
    });
    it('should get profile', function() {
      auth.onCode(null, null, null, null, 'access_token=1234');
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
        provider: 'github',
        token: '1234',
        profile: { user: 'user' }
      });
      expect(next).toHaveBeenCalled();
    });
  });

});
