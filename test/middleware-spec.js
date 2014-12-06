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

  describe('.deserializeCallback()', function() {
    it('should call next with error if error', function() {
      middleware.deserializeCallback(req, next, true, undefined);
      expect(next).toHaveBeenCalledWith(true);
    });
    it('should set req.session.user to user', function() {
      var user = { id: '1234' };
      middleware.deserializeCallback(req, next, undefined, user);
      expect(req.user).toEqual(user);
      expect(req.session.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });
  });

});
