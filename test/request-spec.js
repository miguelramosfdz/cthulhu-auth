'use strict';

var cthulhuAuth = require('../src');
var http = require('http');

describe('request', function() {

  var request, req, next;

  beforeEach(function() {
    next = jasmine.createSpy('next');
    request = cthulhuAuth.request;
    req = http.IncomingMessage;
    req.session = {};
  });

  afterEach(function() {
    request = null;
    req = null;
  });

  describe('.isAuthenticated()', function() {
    it('should return true if user', function() {
      req.session.user = true;
      expect(request.isAuthenticated.apply(req)).toEqual(true);
    });
    it('should return false if no user', function() {
      req.user = false;
      expect(request.isAuthenticated.apply(req)).toEqual(false);
    });
  });

  describe('.logIn()', function() {
    it('should set value of req.session', function() {
      request.logIn.call(req, { id: 'foo' });
      expect(req.session.user).toEqual('foo');
    });
  });

  describe('.deserializeUser()', function() {
    var callback = jasmine.createSpy('callback');
    it('should call next if no req.session.user', function() {
      req.session.user = undefined;
      request.deserializeUser(callback)(req, undefined, next);
      expect(next).toHaveBeenCalled();
    });
    it('should call callback if req.session.user', function() {
      req.session.user = '1234';
      request.deserializeUser(callback)(req, undefined, next);
      expect(callback).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('.logOut()', function() {
    it('should set value of req.session', function() {
      request.logOut.call(req);
      expect(req.session.user).toEqual(undefined);
    });
  });

});
