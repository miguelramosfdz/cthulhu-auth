"use strict";

var request = require('./request');
var middleware = require('./middleware');

/**
 * Strategies
 * @type {exports}
 */
var GithubStrategy =
exports.GithubStrategy = require('./strategies/github');

var GoogleStrategy =
exports.GoogleStrategy = require('./strategies/google');

var TwitterStrategy =
exports.TwitterStrategy = require('./strategies/twitter');

var FacebookStrategy =
exports.FacebookStrategy = require('./strategies/facebook');

var FoursquareStrategy =
exports.FoursquareStrategy = require('./strategies/foursquare');

exports.use = function(strategy, config) {
  switch(strategy) {
    case 'Facebook':
      exports.Facebook = FacebookStrategy(config);
      break;
    case 'Google':
      exports.Google = GoogleStrategy(config);
      break;
    case 'Foursquare':
      exports.Foursquare = FoursquareStrategy(config);
      break;
    case 'Twitter':
      exports.Twitter = TwitterStrategy(config);
      break;
    case 'Github':
      exports.Github = GithubStrategy(config);
      break;
    default:
      throw new Error('Must supply valid strategy.');
  }
};

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
