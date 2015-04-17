var Klass = require('./extend');
var Emitter = require('./emitter');
var _ = require('./util');


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