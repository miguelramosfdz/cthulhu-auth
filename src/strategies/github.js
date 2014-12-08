'use strict';

/**
 * Module dependencies
 * @type {exports}
 * @private
 */
var _ = require('lodash');
var qs = require('querystring');
var request = require('superagent');

/**
 * Factory function for generating Github authentication strategy
 * @param {Object} config
 * @returns {Object}
 */
module.exports = function GithubStrategy(config) {

  var strategy = _.extend({}, config);

  /**
   * Check for necessary configurations
   */
  _.each(['client_id','client_secret','callback_url'], function(key) {
    if (!config[key]) {
      throw new Error('Must supply Github Strategy with '+key);
    }
  });

  strategy.authorizeUrl = 'https://github.com/login/oauth/authorize?';
  strategy.tokenUrl = 'https://github.com/login/oauth/access_token';
  strategy.profileUrl = 'https://api.github.com/user?';

  /**
   * Authorize user
   * @param  {IncomingMessage} req
   * @param  {ServerResponse} res
   */
  strategy.authorize = function(req, res) {
    res.redirect(strategy.authorizeUrl+qs.stringify({
      client_id: strategy.client_id,
      scope: 'user,repo,user:email',
      redirect_uri: strategy.callback_url,
      state: res.locals._csrf
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
      .send({
        client_id: strategy.client_id,
        client_secret: strategy.client_secret,
        code: req.query.code,
        redirect_uri: strategy.callback_url
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

    var query = qs.parse(response.body);
    var token = query.access_token;

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
      provider: 'github',
      token: token,
      profile: JSON.parse(response.text)
    };

    next();
  };

  return strategy;
};
