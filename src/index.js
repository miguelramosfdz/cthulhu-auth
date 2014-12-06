"use strict";

var request = require('./request');
var middleware = require('./middleware');

/**
 * Strategies
 * @type {exports}
 */
exports.Facebook = require('./strategies/facebook');
exports.Google = require('./strategies/google');
exports.Twitter = require('./strategies/twitter');
exports.Foursquare = require('./strategies/foursquare');
exports.Github = require('./strategies/github');

// Export deserializeUser
exports.deserializeUser = middleware.deserializeUser;

/**
 * Initialize Cthulhu Auth
 * @return {Function}
 * @public
 */
exports.initialize = function(config) {
  return function(req, res, next) {
    req.isAuthenticated = request.isAuthenticated;
    req.login = request.logIn;
    req.logout = request.logOut;
    next();
  };
};
