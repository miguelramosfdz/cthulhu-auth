'use strict';

var http = require('http');
var request = require('../src/request');

describe('request', function() {

  var req, next;

  beforeEach(function() {
    next = jasmine.createSpy('next');
    req = http.IncomingMessage;
    req.session = {};
  });

  afterEach(function() {
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

  describe('.logOut()', function() {
    it('should set value of req.session', function() {
      request.logOut.call(req);
      expect(req.session.user).toEqual(undefined);
    });
  });

});
