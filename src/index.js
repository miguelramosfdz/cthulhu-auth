"use strict";

var request =
exports.request = require("./request");

/**
 * Strategies
 * @type {exports}
 */
exports.Facebook = require('./strategies/facebook');
exports.Google = require('./strategies/google');
exports.Twitter = require('./strategies/twitter');
exports.Foursquare = require('./strategies/foursquare');
exports.Github = require('./strategies/github');

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
