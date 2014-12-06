'use strict';

/**
 * Callback after user deserialized
 * @param {IncomingMessage} req
 * @param {Function} next
 * @param {?Error} err
 * @param {?mongoose.Model} user
 */
var deserializeCallback =
exports.deserializeCallback = function(req, next, err, user) {
  if (err) {
    return next(err);
  }

  req.session.user = user;
  next();
};

/**
 * Deserializer user
 * @param  {Function} callback
 * @return {Function}
 */
exports.deserializeUser = function(callback) {
  return function(req, res, next) {
    if (req.session && req.session.user) {
      return callback(req.session.user, deserializeCallback.bind({}, req, next));
    }
    next();
  };
};
