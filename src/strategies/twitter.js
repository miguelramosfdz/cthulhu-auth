"use strict";

/**
 * Module dependencies
 * @type {exports}
 * @private
 */
var _ = require('lodash');
var oauth = require("oauth");

module.exports = function Twitter(options) {

  var strategy = _.extend({}, options);

  /**
   * Check for necessary configurations
   */
  _.each(['consumer_secret','consumer_key','callback_url'], function(key) {
    if (!options[key]) {
      throw new Error("Must supply Twitter Strategy with "+key);
    }
  });

  strategy.request_token_url = "https://twitter.com/oauth/request_token";
  strategy.access_token_url = "https://twitter.com/oauth/access_token";
  strategy.profile_url = "https://api.twitter.com/1.1/account/verify_credentials.json";
  strategy.authorize_url = "https://twitter.com/oauth/authorize?oauth_token=";

  /**
   * Twitter OAuth consumer
   * @type {oauth.OAuth}
   */
  strategy.consumer = new oauth.OAuth(
    strategy.request_token_url,
    strategy.access_token_url,
    strategy.consumer_key,
    strategy.consumer_secret,
    "1.0A",
    strategy.callback_url,
    "HMAC-SHA1"
  );

  /**
   * Authorize user
   * @param  {IncomingMessage}   req
   * @param  {ServerResponse}   res
   * @param  {Function} next
   */
  strategy.authorize = function(req, res, next) {
    strategy
      .consumer
      .getOAuthRequestToken(strategy.onRequestToken.bind({}, res, next));
  };

  /**
   * Handle response from Twitter with request token
   * @param {ServerResponse}   res
   * @param {Function} next
   * @param {?Error}   err
   * @param {string}   token
   * @param {string}   secret
   */
  strategy.onRequestToken = function(res, next, err, token, secret) {
    if (err) {
      return next(err);
    }

    strategy.oauthRequestToken = token;
    strategy.oauthRequestTokenSecret = secret;
    res.redirect(strategy.authorize_url+strategy.oauthRequestToken);
  };

  /**
   * Handle callback request from provider
   * @param  {http.IncomingMessage}   req
   * @param  {http.ServerResponse}   res
   * @param  {Function} next
   */
  strategy.callback = function(req, res, next) {
    strategy.consumer.getOAuthAccessToken(
      strategy.oauthRequestToken,
      strategy.oauthRequestTokenSecret,
      req.query.oauth_verifier,
      strategy.onAccessToken.bind({}, req, res, next)
    );
  };

  /**
   * Retrieve user profile when token is received
   * @param {IncomingMessage}   req
   * @param {ServerResponse}   res
   * @param {Function} next
   * @param {?Error}   err
   * @param {object}   response
   * @param {object}   body
   */
  strategy.onAccessToken = function(req, res, next, err, token, secret) {
    if (err) {
      return next(err);
    }

    /**
     * Clear request token and secret
     */
    delete strategy.oauthRequestToken;
    delete strategy.oauthRequestTokenSecret;

    strategy
      .consumer
      .get(
        strategy.profile_url,
        token,
        secret,
        strategy.onProfile.bind({}, token, secret, req, next)
      );
  };

  /**
   * Set req.oauth when user profile is retrieved
   * @param {string} token
   * @param {string} secret
   * @param {http.IncomingMessage} req
   * @param {Function} next
   * @param {?Error}   err
   * @param {object}   data
   */
  strategy.onProfile = function (token, secret, req, next, err, data) {
    if (err) {
      return next(err);
    }

    req.oauth = {
      provider: 'twitter',
      token: token,
      secret: secret,
      profile: JSON.parse(data)
    };

    return next();
  };

  return strategy;

};
