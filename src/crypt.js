"use strict";

var crypto = require('crypto');

/**
 * Bytesize.
 * @type {number}
 * @private
 */
var len = 128;

/**
 * Iterations. ~300ms
 * @type {number}
 * @private
 */
var iterations = 12000;

/**
 * Make 16 byte, base 24 string salt
 * @return {String}
 * @public
 */
var makeSalt =
exports.makeSalt = function() {
  return crypto.randomBytes(16).toString('base64');
};

/**
 * Hashes a string with optional `salt`, otherwise generate a salt for `pass`
 * and invoke `fn(err, salt, hash)`.
 * @param {String} string String to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @public
 */
exports.hash = function(string, salt, callback) {
  salt = salt || makeSalt();
  crypto.pbkdf2(string, salt, iterations, len, function(err, hash) {
    if (err) {
      return callback(err);
    }
    callback(null, salt, hash);
  });
};

/**
 * Create HMAC from text based on APP_KEY
 * @param {string} text Text to create HMAC
 * @param {string} key Key to use for creating HMAC
 * @return {String}
 * @public
 */
exports.makeHMAC = function(text, key) {
  var hmac = crypto.createHmac('sha1', key);
  hmac.setEncoding('hex');
  hmac.write(text);
  hmac.end();
  return hmac.read();
};
