"use strict";

/**
 * Module dependencies
 * @type {exports}
 * @api private
 */
var _ = require('lodash');
var rest = require('superagent');
var qs = require("querystring");

/**
 * Factory function for generating Foursquare authentication strategy
 * @param {Object} options
 * @returns {Object}
 */
module.exports = function Foursquare(options) {

  /**
   * Check for necessary elements
   */
  _.each(['client_id', 'client_secret', 'callback_url'], function(key) {
    if (!options[key]) {
      throw new Error("Must supply Foursquare Strategy with "+key);
    }
  });

  var strategy = _.extend({}, options);

  strategy.authorizeUrl = "https://foursquare.com/oauth2/authenticate?";
  strategy.tokenUrl = "https://foursquare.com/oauth2/access_token";
  strategy.profileUrl = "https://api.foursquare.com/v2/users/self?";

  strategy.authorize = function(req, res) {
    res.redirect(strategy.authorizeUrl+qs.stringify({
      response_type: "code",
      client_id: strategy.client_id,
      redirect_uri: strategy.callback_url
    }));
  };

  strategy.callback = function(req, res, next) {
    rest
      .get(strategy.tokenUrl)
      .query({
        client_id: strategy.client_id,
        client_secret: strategy.client_secret,
        grant_type: 'authorization_code',
        redirect_uri: strategy.callback_url,
        code: req.query.code
      })
      .end(strategy.onCode.bind({}, req, res, next));
  };

  strategy.onCode = function(req, res, next, err, response, body) {
    if (err) {
      return next(err);
    }

    var token = body.access_token;

    /**
     * Get profile of user
     */
    rest
      .get(strategy.profileUrl)
      .query({
        oauth_token: body.access_token,
        v: "20140806"
      })
      .end(strategy.onProfile.bind(body.access_token, req, next));
  };

  strategy.onProfile = function(token, req, next, err, response, body) {
    req.oauth = {
      provider: 'foursquare',
      token: token,
      profile: body.user
    };
    return next();
  };

  return strategy;

};
