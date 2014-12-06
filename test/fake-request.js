'use strict';

var end =
exports.end = jasmine.createSpy('end');

exports.data = jasmine.createSpy('data').andReturn({
  end: end
});

exports.query = jasmine.createSpy('query').andReturn({
  end: end
});

exports.request = require('superagent');
