"use strict";

/**
 * Module depenencies
 * @type {exports}
 * @private
 */
var _ = require('lodash');
var qs = require('querystring');
var request = require('superagent');

/**
 * Factory function for creating Google authentication strategy
 * @param config
 * @returns {object}
 */
module.exports = function Google(config) {

  var strategy = _.extend({}, config);

  /**
   * Check for necessary elements
   */
  _.each(['client_id', 'client_secret', 'redirect_uri'], function(key) {
    if (!config[key]) {
      throw new Error("Must supply Google Strategy with "+key);
    }
  });

  strategy.authorizeUrl = "https://accounts.google.com/o/oauth2/auth?";
  strategy.tokenUrl = "https://www.googleapis.com/oauth2/v3/token";
  strategy.profileUrl = "https://www.googleapis.com/plus/v1/people/me?";

  /**
   * Authorize user
   * @param  {IncomingMessage} req
   * @param  {ServerResponse} res
   */
  strategy.authorize = function(req, res) {
    res.redirect(strategy.authorizeUrl+qs.stringify({
      response_type: 'code',
      client_id: strategy.client_id,
      redirect_uri: strategy.redirect_uri,
      scope: 'email profile',
      approval_prompt: 'force'
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
      .post(strategy.tokenUrl)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        code: req.query.code,
        client_id: strategy.client_id,
        client_secret: strategy.client_secret,
        redirect_uri: strategy.redirect_uri,
        grant_type: 'authorization_code'
      })
      .end(strategy.onToken.bind({}, req, next));
  };

  /**
   * Retrieve user profile when token is received
   * @param {http.IncomingMessage} req
   * @param {Function} next
   * @param {object}   response
   */
  strategy.onToken = function(req, next, response) {
    if (response.error) {
      return next(response.error);
    }

    var token = JSON.parse(response.text).access_token;

    request
      .get(strategy.profileUrl)
      .query({
        access_token: token
      })
      .end(strategy.onProfile.bind({}, token, req, next));
  };

  /**
   * Set req.oauth when user profile is retrieved
   * @param {string} token
   * @param {http.IncomingMessage} req
   * @param {Function} next
   * @param {object}   response
   */
  strategy.onProfile = function(token, req, next, response) {
    if (response.error) {
      return next(response.error);
    }

    req.oauth = {
      provider: 'google',
      token: token,
      profile: JSON.parse(response.text)
    };

    return next();
  };

  return strategy;

};
