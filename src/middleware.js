'use strict';

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
