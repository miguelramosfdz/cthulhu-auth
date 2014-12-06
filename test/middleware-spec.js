'use strict';

describe('middleware', function() {

  var req, next, callback;
  var middleware = require('../src/middleware');

  beforeEach(function() {
    callback = jasmine.createSpy('callback');
    next = jasmine.createSpy('next');
    req = {
      session: {}
    };
  });

  describe('.deserializeUser()', function() {
    it('should call next if no req.session.user', function() {
      req.session.user = undefined;
      middleware.deserializeUser(callback)(req, undefined, next);
      expect(next).toHaveBeenCalled();
    });
    it('should call callback if req.session.user', function() {
      req.session.user = '1234';
      middleware.deserializeUser(callback)(req, undefined, next);
      expect(callback).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

});
