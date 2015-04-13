var extend = require('./extend');
var emitter = require('./emitter');
var _ = require('./util');

var Kclass = function(o){
    var fn = extend.call(_.isFn(o) ? o : function () {}, o, 1);
    return fn;
};

module.exports = Kclass;