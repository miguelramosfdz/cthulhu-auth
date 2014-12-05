"use strict";

/**
 * Check if req is authenticated
 * The scope inside of this function will be that of req.
 * @return {Boolean}
 * @public
 */
exports.isAuthenticated = function() {
  return !!this.user;
};

/**
 * Log in user
 * The scope inside of this function will be that of req.
 * @param  {User} user
 * @param  {Object} options
 */
exports.logIn = function(user) {
  this.session.user = user.id;
};

/**
 * Log out user
 * The scope inside of this function will be that of req.
 * @param  {User} user
 * @param  {Object} options
 * @public
 */
exports.logOut = function() {
  delete this.session.user;
};

/**
 * Deserializer user
 * @param  {Function} callback
 * @return {Function}
 */
exports.deserializeUser = function(callback) {
  return function(req, res, next) {
    if (req.session && req.session.user) {
      return callback(req.session.user, function(err, user) {
        req.user = user;
        next();
      });
    }
    next();
  };
};
