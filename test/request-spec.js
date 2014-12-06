'use strict';

describe('request', function() {
  var req, auth, next;
  var http = require('http');

  beforeEach(function() {
    next = jasmine.createSpy('next');
    auth = require('../src').request;
    req = http.IncomingMessage;
    req.session = {};
  });

  afterEach(function() {
    auth = null;
    req = null;
  });

  describe('.isAuthenticated()', function() {
    it('should return true if user', function() {
      req.session.user = true;
      expect(auth.isAuthenticated.apply(req)).toEqual(true);
    });
    it('should return false if no user', function() {
      req.user = false;
      expect(auth.isAuthenticated.apply(req)).toEqual(false);
    });
  });

  describe('.logIn()', function() {
    it('should set value of req.session', function() {
      auth.logIn.call(req, { id: 'foo' });
      expect(req.session.user).toEqual('foo');
    });
  });

  describe('.deserializeUser()', function() {
    var callback = jasmine.createSpy('callback');
    it('should call next if no req.session.user', function() {
      req.session.user = undefined;
      auth.deserializeUser(callback)(req, undefined, next);
      expect(next).toHaveBeenCalled();
    });
    it('should call callback if req.session.user', function() {
      req.session.user = '1234';
      auth.deserializeUser(callback)(req, undefined, next);
      expect(callback).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('.logOut()', function() {
    it('should set value of req.session', function() {
      auth.logOut.call(req);
      expect(req.session.user).toEqual(undefined);
    });
  });

});
