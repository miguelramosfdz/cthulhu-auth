'use strict';

describe('Strategy: Foursquare', function() {

  var qs = require('querystring');
  var request = require('superagent');
  var foursquare = require('../src').FoursquareStrategy;

  var auth, res, query, end;

  beforeEach(function() {
    auth = foursquare({
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
  });

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
    expect(auth.client_id).toEqual('fooId');
    expect(auth.client_secret).toEqual('fooSecret');
    expect(auth.callback_url).toEqual('http://foo.com');
  });

  describe('.authorize()', function() {
    it('should call res.redirect with correct url', function() {
      auth.authorize(null, res, null);
      expect(res.redirect).toHaveBeenCalledWith(auth.authorizeUrl+qs.stringify({
        response_type: 'code',
        client_id: 'fooId',
        redirect_uri: 'http://foo.com'
      }));
    });
  });

  describe('.callback()', function() {
    it('should send GET request with correct params', function() {
      auth.callback({ query: { code: '1234'} });
      expect(request.get).toHaveBeenCalledWith(auth.tokenUrl);
      expect(query).toHaveBeenCalledWith({
        client_id: 'fooId',
        client_secret: 'fooSecret',
        grant_type: 'authorization_code',
        redirect_uri: 'http://foo.com',
        code: '1234'
      });
      expect(end).toHaveBeenCalled();
    });
  });

  describe('.onCode()', function() {
    it('should call next if error', function() {
      var next = jasmine.createSpy('next');
      auth.onCode(null, null, next, true, null, { access_token: '1234' });
      expect(next).toHaveBeenCalledWith(true);
    });
    it('should get profile', function() {
      auth.onCode(null, null, null, null, null, { access_token: '1234' });
      expect(request.get).toHaveBeenCalledWith(auth.profileUrl);
      expect(query).toHaveBeenCalledWith({
        oauth_token: '1234',
        v: '20140806'
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
        provider: 'foursquare',
        token: '1234',
        profile: 'user'
      });
      expect(next).toHaveBeenCalled();
    });
  });

});
