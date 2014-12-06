'use strict';

describe('Strategy: Facebook', function() {

  var auth, res, query, end;
  var qs = require('querystring');
  var request = require('superagent');
  var facebook = require('../src').FacebookStrategy;

  beforeEach(function() {
    auth = facebook({
      app_id: 'fooId',
      app_secret: 'fooSecret',
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
  });

  afterEach(function() {
    auth = undefined;
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

  it('should have urls', function() {
    expect(auth.authorizeUrl).not.toEqual(undefined);
    expect(auth.tokenUrl).not.toEqual(undefined);
    expect(auth.profileUrl).not.toEqual(undefined);
  });

  it('should set Facebook', function() {
    expect(auth.app_id).toEqual('fooId');
    expect(auth.app_secret).toEqual('fooSecret');
    expect(auth.callback_url).toEqual('http://foo.com');
  });

  describe('.authorize()', function() {
    it('should call res.redirect with correct url', function() {
      res.locals = {
        _csrf: '1234'
      };
      auth.authorize(null, res, null);
      expect(res.redirect).toHaveBeenCalledWith(auth.authorizeUrl+qs.stringify({
        client_id: 'fooId',
        state: res.locals._csrf,
        redirect_uri: 'http://foo.com',
        scope: "public_profile,email"
      }));
    });
  });

  describe('.callback()', function() {
    it('should send GET request with correct params', function() {
      auth.callback({ query: { code: '1234'} });
      expect(request.get).toHaveBeenCalledWith(auth.tokenUrl);
      expect(query).toHaveBeenCalledWith({
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
      auth.onToken(null, next, true, null, null);
      expect(next).toHaveBeenCalledWith(true);
    });
    it('should get profile', function() {
      auth.onToken(null, null, null, null, 'access_token=1234');
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
        provider: 'facebook',
        token: '1234',
        profile: { user: 'user' }
      });
      expect(next).toHaveBeenCalled();
    });
  });

});
