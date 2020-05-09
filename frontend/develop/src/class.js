/*!
 * class extension for JavaScript.
 */

//! todo: Consider moving over to ES6 with class and babel.

// from O'Reilly JavaScript 6th Ed. p119
function inherit(p) {
    if (!p) throw TypeError("can't inherit null");
    if (Object.create) {
        return Object.create(p);
    }
    var t = typeof p;
    if (t !== 'object' && t !== 'function') throw TypeError("can't inherit type");
    var f = function(){};
    f.prototype = p;
    return new f();
}

// from O'Reilly JavaScript 6th Ed. p179
var extend = (function(){
    var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString" ];
    for (var p in {toString:null}) {
        return function extend(o) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var prop in source) {
                    o[prop] = source[prop];
                }
            }
            return o;
        };
    }
    return function patched_extend(o) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var prop in source) {
                o[prop] = source[prop];
            }
            for (var j = 0; j < protoprops.length; j++) {
                prop = protoprops[j];
                if (source.hasOwnProperty(prop)) {
                    o[prop] = source[prop];
                }
            }
        }
        return o;
    };
}());

// from O'Reilly JavaScript again...
function defineSubClass(superclass, ctor, methods, statics) {
    ctor.prototype = inherit(superclass.prototype);
    ctor.prototype.constructor = ctor;
    if (methods) {
        extend(ctor.prototype, methods);
    }
    if (statics) {
        extend(ctor, statics);
    }
    return ctor;
}

Function.prototype.extend = function(ctor, methods, statics) {
    return defineSubClass(this, ctor, methods, statics);
};
