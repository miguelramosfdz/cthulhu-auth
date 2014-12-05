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
var Auth = require("./auth");
var Crypt = require("./crypt");

/**
 * Factory function for constructing a auth module
 * @public
 */
module.exports = function (config) {

  config = config || {};

  var auth = {};

  /**
   * @type {Auth}
   * @public
   */
  auth.auth = Auth;

  /**
   * @type {Crypt}
   * @public
   */
  auth.crypt = Crypt;

  /**
   * Check that config was passed
   */
  if (!_.isPlainObject(config)) {
    throw new Error('Must pass configuration object.');
  }

  /**
   * Attach Facebook OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Facebook)) {
    auth.Facebook = require('./strategies/facebook')(config.Facebook);
  }

  /**
   * Attach Google OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Google)) {
    auth.Google = require('./strategies/google')(config.Google);
  }

  /**
   * Attach Twitter OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Twitter)) {
    auth.Twitter = require('./strategies/twitter')(config.Twitter);
  }

  /**
   * Attach Foursquare OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Foursquare)) {
    auth.Foursquare = require('./strategies/foursquare')(config.Foursquare);
  }

  /**
   * Attach Github OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Github)) {
    auth.Github = require('./strategies/github')(config.Github);
  }

  /**
   * Attach Authy strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Authy)) {
    auth.Authy = require('./strategies/authy')(config.Authy);
  }

  /**
   * Initialize Sentinal
   * @return {Function}
   * @public
   */
   auth.initialize = function(config) {
    return function(req, res, next) {
      req.isAuthenticated = Auth.isAuthenticated;
      req.login = Auth.logIn;
      req.logout = Auth.logOut;
      next();
    };
  };

  return auth;

};
