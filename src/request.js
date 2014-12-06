"use strict";

/**
 * Check if req is authenticated
 * The scope inside of this function will be that of req.
 * @return {Boolean}
 * @public
 */
exports.isAuthenticated = function() {
  return !!this.session.user;
};

/**
 * Log in user
 * The scope inside of this function will be that of req.
 * @param  {User} user
 * @param  {Object} options
 */
exports.logIn = function(user) {
  this.session.user = user;
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
