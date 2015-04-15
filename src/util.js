"use strict";

var _ = function(obj) {},
    f = 'function';

_.isFn = function(o) {
    return typeof o === f
};

_.noop = function(){};

module.exports = _;