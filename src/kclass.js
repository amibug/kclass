var Klass = require('./klass');
var Emitter = require('./emitter');
var _ = require('./util');


var proto = 'prototype',
    Kclass =  new Klass(),
    fn = Kclass[proto];

fn.implement(new Emitter());

fn.implement({
    init: function(){
        this.emit('$init');
    },
    destroy: function(){
        this.emit('$destroy');
    }
})

module.exports = Kclass;