var Person = Kclass.extend({
    init: function(){
        console.log('initPerson');
    },
    call: function(){
        console.log('call');
    }
});
var Son = Person.extend({
    init: function(){
        this.supr();
        console.log('initSon');
    }
});
var Daughter = Person.extend({
    init: function(){
        this.supr();
        console.log('initDaughter');
    }
});


var Tom = new Son({
    data: 'xxx'
});
var Lili = new Daughter();

Tom.on('init', function(){console.log('initSonCB');});
Tom.emit('init');
Lili.emit('init');
debugger;
Tom.off('init');
Tom.emit('init');