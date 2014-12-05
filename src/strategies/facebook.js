"use strict";

/**
 * Module dependencies
 * @type {exports}
 */
var _ = require('lodash');
var request = require('superagent');
var qs = require('querystring');

/**
 * Export Facebook module
 * @param {Object} options
 * @returns {module}
 * @constructor
 */
module.exports = function Facebook(options) {

  /**
   * Check for necessary elements
   */
  ['app_id', 'callback_url', 'app_secret'].forEach(function(key) {
    if (!options[key]) {
      throw new Error("Must supply Facebook with "+key);
    }
  });

  var strategy = _.extend({}, options);

  strategy.autorizeUrl = "https://www.facebook.com/dialog/oauth?";
  strategy.callbackUrl = "https://graph.facebook.com/oauth/access_token?";
  strategy.profileUrl = "https://graph.facebook.com/me?";

  /**
   * Send request to authorize request to Facebook
   * @param {http.IncomingMessage} req
   * @param {express.response} res
   * @param {Function} next
   */
  strategy.authorize = function(req, res, next) {
    res.redirect(strategy.authorizeUrl + qs.stringify({
      client_id: strategy.app_id,
      state: res.locals._csrf,
      redirect_uri: strategy.callback_url,
      scope: "public_profile,email"
    }));
  };

  strategy.callback = function(req, res, next) {
    request
      .get(strategy.callbackUrl)
      .query({
        client_id: strategy.app_id,
        redirect_uri: strategy.callback_url,
        client_secret: strategy.app_secret,
        code: req.query.code
      })
      .end(strategy.onCode.bind({}, req, next));
  };

  strategy.onCode = function(req, next, err, response, body) {
    /**
     * Parse query string returned from Facebook
     */
    var query = qs.parse(body);

    /**
     * Get access_token
     * @type {String}
     */
    var token = query.access_token;

    request
      .get(strategy.profileUrl)
      .query({
        access_token: token
      })
      .end(strategy.onProfile);
  };

  /**
   * Get user's Facebook profile
   * @param {string} token
   * @param {http.IncomingMessage} req
   * @param {function} next
   * @param {?Error} err
   * @param {object} response
   * @param {object} body
   */
  strategy.onProfile = function(token, req, next, err, response, body) {
    req.oauth = {
      provider: 'facebook',
      token: token,
      profile: body
    };
    return next();
  };

  return strategy;

};
