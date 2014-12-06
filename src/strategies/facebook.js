"use strict";

/**
 * Module dependencies
 * @type {exports}
 */
var _ = require('lodash');
var request = require('superagent');
var qs = require('querystring');

/**
 * Factory function for generating Facebook authentication strategy
 * @param {Object} options
 * @returns {module}
 */
module.exports = function Facebook(options) {

  /**
   * Check for necessary configurations
   */
  _.each(['app_id', 'callback_url', 'app_secret'], function(key) {
    if (!options[key]) {
      throw new Error("Must supply Facebook with "+key);
    }
  });

  var strategy = _.extend({}, options);

  strategy.authorizeUrl = "https://www.facebook.com/dialog/oauth?";
  strategy.tokenUrl = "https://graph.facebook.com/oauth/access_token?";
  strategy.profileUrl = "https://graph.facebook.com/me?";

  /**
   * Authorize user
   * @param  {IncomingMessage} req
   * @param  {ServerResponse} res
   */
  strategy.authorize = function(req, res, next) {
    res.redirect(strategy.authorizeUrl + qs.stringify({
      client_id: strategy.app_id,
      state: res.locals._csrf,
      redirect_uri: strategy.callback_url,
      scope: "public_profile,email"
    }));
  };

  /**
   * Handle callback request from provider
   * @param  {http.IncomingMessage}   req
   * @param  {http.ServerResponse}   res
   * @param  {Function} next
   */
  strategy.callback = function(req, res, next) {
    request
      .get(strategy.tokenUrl)
      .query({
        client_id: strategy.app_id,
        redirect_uri: strategy.callback_url,
        client_secret: strategy.app_secret,
        code: req.query.code
      })
      .end(strategy.onToken.bind({}, req, next));
  };

  /**
   * Retrieve user profile when token is received
   * @param {http.IncomingMessage}   req
   * @param {Function} next
   * @param {object}   response
   */
  strategy.onToken = function(req, next, response) {
    if (response.error) {
      return next(response.error);
    }

    /**
     * Get access_token
     * @type {String}
     */
    var token = qs.parse(response.text).access_token;

    request
      .get(strategy.profileUrl)
      .query({
        access_token: token
      })
      .end(strategy.onProfile.bind({}, token, req, next));
  };

  /**
   * Get user's Facebook profile
   * @param {string} token
   * @param {http.IncomingMessage} req
   * @param {function} next
   * @param {object} response
   */
  strategy.onProfile = function(token, req, next, response) {
    if (response.error) {
      return next(response.error);
    }

    // Set req.oauth
    req.oauth = {
      provider: 'facebook',
      token: token,
      profile: JSON.parse(response.text)
    };

    return next();
  };

  return strategy;

};
