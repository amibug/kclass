(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Kclass"] = factory();
	else
		root["Kclass"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Klass = __webpack_require__(1);
	var Emitter = __webpack_require__(2);
	var _ = __webpack_require__(3);


	var proto = 'prototype',
	    Kclass =  new Klass(),
	    fn = Kclass[proto];

	fn.implement(new Emitter({}));

	fn.implement({
	    init: function(){
	        this.emit('init');
	    },
	    destroy: function(){
	        this.off();
	        this.emit('destroy');
	    }
	})

	module.exports = Kclass;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _ = __webpack_require__(3);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;


	function Emitter(obj) {
	    if (obj) return mixin(obj);
	};

	function mixin(obj) {
	    for (var key in Emitter.prototype) {
	        obj[key] = Emitter.prototype[key];
	    }
	    return obj;
	}

	Emitter.prototype.on =
	    Emitter.prototype.addEventListener = function(event, fn){
	        this._callbacks = this._callbacks || {};
	        (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	            .push(fn);
	        return this;
	    };

	Emitter.prototype.once = function(event, fn){
	    function on() {
	        this.off(event, on);
	        fn.apply(this, arguments);
	    }

	    on.fn = fn;
	    this.on(event, on);
	    return this;
	};

	Emitter.prototype.off =
	    Emitter.prototype.removeListener =
	        Emitter.prototype.removeAllListeners =
	            Emitter.prototype.removeEventListener = function(event, fn){
	                this._callbacks = this._callbacks || {};

	                // all
	                if (0 == arguments.length) {
	                    this._callbacks = {};
	                    return this;
	                }

	                // specific event
	                var callbacks = this._callbacks['$' + event];
	                if (!callbacks) return this;

	                // remove all handlers
	                if (1 == arguments.length) {
	                    delete this._callbacks['$' + event];
	                    return this;
	                }

	                // remove specific handler
	                var cb;
	                for (var i = 0; i < callbacks.length; i++) {
	                    cb = callbacks[i];
	                    if (cb === fn || cb.fn === fn) {
	                        callbacks.splice(i, 1);
	                        break;
	                    }
	                }
	                return this;
	            };

	Emitter.prototype.emit = function(event){
	    this._callbacks = this._callbacks || {};
	    var args = [].slice.call(arguments, 1)
	        , callbacks = this._callbacks['$' + event];

	    if (callbacks) {
	        callbacks = callbacks.slice(0);
	        for (var i = 0, len = callbacks.length; i < len; ++i) {
	            callbacks[i].apply(this, args);
	        }
	    }

	    return this;
	};

	Emitter.prototype.listeners = function(event){
	    this._callbacks = this._callbacks || {};
	    return this._callbacks['$' + event] || [];
	};

	Emitter.prototype.hasListeners = function(event){
	    return !! this.listeners(event).length;
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ = function(obj) {},
	    f = 'function';

	_.isFn = function(o) {
	    return typeof o === f
	};

	_.noop = function(){};

	module.exports = _;

/***/ }
/******/ ])
});
;