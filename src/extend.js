"use strict";

var f = 'function',
    fnTest = /xyz/.test(function () {xyz}) ? /\bsupr\b/ : /.*/,
    proto = 'prototype';

function isFn(o) {
    return typeof o === f
}

function wrap(k, fn, supr) {
    // supr
    return function () {
        var tmp = this.supr;
        this.supr = supr[proto][k];
        var undef = {}.fabricatedUndefined;
        var ret = undef;
        try {
            ret = fn.apply(this, arguments);
        } finally {
            this.supr = tmp;
        }
        return ret;
    }
}

function process(what, o, supr) {
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            what[k] = isFn(o[k])
                && isFn(supr[proto][k])
                && fnTest.test(o[k])
                ? wrap(k, o[k], supr) : o[k]
        }
    }
}


function extend(o, fromSub) {

    function noop() {}
    noop[proto] = this[proto];
    // supr Class
    var supr = this,
        prototype = new noop(),
        isFunction = isFn(o),
        _constructor = isFunction ? o : this,
        _methods = isFunction ? {} : o;

    function fn() {
        if (this.initialize) this.initialize.apply(this, arguments);
        else {
            fromSub || isFunction && supr.apply(this, arguments);
            _constructor.apply(this, arguments);
        }
    }

    // 添加实例方法,添加到prototype中
    fn.methods = function (o) {
        process(prototype, o, supr);
        // noop[proto] = this[proto];fn[proto] = prototype; to complete inherit
        return this;
    };

    // fn.prototype.constructor = fn;
    fn.methods.call(fn, _methods).prototype.constructor = fn;

    fn.extend = extend;
    fn[proto].implement = fn.statics = function (o, optFn) {
        o = typeof o == 'string' ? (function () {
            var obj = {};
            obj[o] = optFn;
            return obj;
        }()) : o;
        process(this, o, supr);
        return this;
    };

    return fn;
}

module.exports = extend;
