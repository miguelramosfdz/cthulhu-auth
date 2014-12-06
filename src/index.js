"use strict";

/**
 * Module dependencies
 * @type {exports}
 * @private
 */
var _ = require('lodash');

/**
 * Application dependencies
 * @type {exports}
 * @private
 */
var requestExtentions = require("./req-extensions");

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
    req.isAuthenticated = requestExtentions.isAuthenticated;
    req.login = requestExtentions.logIn;
    req.logout = requestExtentions.logOut;
    next();
  };
};
