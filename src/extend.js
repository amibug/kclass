"use strict";
var _ = require('./util');

var fnTest = /xyz/.test(function () {xyz}) ? /\bsupr\b/ : /.*/,
    proto = 'prototype';


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
            what[k] = _.isFn(o[k])
                && _.isFn(supr[proto][k])
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
        isFunction = _.isFn(o),
        _constructor = isFunction ? o : this,
        _methods = isFunction ? {} : o;

    function fn() {
        if (this.init) this.init.apply(this, arguments);
        else {
            fromSub || isFunction && supr.apply(this, arguments);
            _constructor.apply(this, arguments);
        }
    }

    // fn.methods添加方法到prototype中
    fn.methods = function (o) {
        process(prototype, o, supr);
        // noop[proto] = this[proto];fn[proto] = prototype; to complete inherit
        fn[proto] = prototype;
        return this;
    };

    // fn.prototype.constructor = fn;
    fn.methods.call(fn, _methods).prototype.constructor = fn;

    fn.extend = extend;
    // fn[proto].implement添加方法到prototype中
    // fn.statics添加方法到fn中
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

function klass(o) {
    return extend.call(_.isFn(o) ? o : function () {}, o, 1)
}

module.exports = klass;
