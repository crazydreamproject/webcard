/*!
 * WebCard script
 */

//! todo: Consider moving over to ES6 with class and babel.
import WcPart from './part.js';
import WcContainer from './container.js';
import WcStorage from './storage.js';
import WcParser from './talk.js';
import WcEvent from './event.js';
import WcMode from './mode.js';
import DomOp from './dom.js';
import WcInterpreter from './interpreter.js';
import WcException from './exception.js';

var editKey = WcStorage.keys.edit;
function WcScript(owner) {
    this.language = WcScript.languages.CommandTalk;
    this.script = "";
    this.handlers = null;
    this.owner = owner;
}
WcScript.languages = {
    JavaScript: "JavaScript",
    CommandTalk: "CommandTalk"
};
WcScript.prototype = {
    constructor: WcScript,
    getLanguage: function() { return this.language; },
    setLanguage: function(lang) { this.language = lang; },
    getScript: function() { return this.script; },
    setScript: function(script) {
        this.script = script;
        if (!script) {
            this.setHandlers(null);
            return;
        }
        var result = WcParser.parser.parse(script);
        if ($.isArray(result)) {
            this.setHandlers(result);
            console.log(result[0].exec);
        } else {
            this.setHandlers(null);
        }
    },
    interpret: function(val) {
        if (val) {
            this.setScript(val);
        }
        return this.script;
    },
    getHandlers: function() { return this.handlers; },
    setHandlers: function(handlers) { this.handlers = handlers; },
    bindHandlers: function(elemId) {
        //! todo: find a better way to match 2 arrays element name
        // first, remove all talk related event handlers
        $(elemId).off('.talk');
        if (!this.handlers)
            return;
        // assuming this.handlers are array
        var handlerList = this.handlers;
        var itsMe = this.owner;
        for (var idx in this.handlers) {
            var handler = this.handlers[idx];
            if (handler.type === "handler") {
                // check handler names matches system message event name
                var found = false;
                for (var msg in WcEvent.systemMessages) {
                    var ev = WcEvent.systemMessages[msg];
                    // remove first and last double quote added...
                    if (handler.name === msg) {
                        //! fixme: bug: this would only apply last handler.exec on multiple handlers...
                        $(elemId).on(ev + '.talk', function(ev) {
                            // only execute script on browse mode.
                            if (WcMode.getMode() === WcMode.modes.browse) {
                                // find again the right handler... (using var 'handler' will result in last handler...)
                                var h = handler;
                                for (var i in handlerList) {
                                    if (WcEvent.systemMessages[handlerList[i].name] === ev.type) {
                                        h = handlerList[i];
                                        break;
                                    }
                                }
                                // copy argument but the first one and pass to exec
                                var args = new Array(arguments.length);
                                for (var i = 0; i < arguments.length; i++) {
                                    args[i] = arguments[i];
                                }
                                args[0] = h.name; // set first param to handler name
                                WcInterpreter.params = args.slice(); // shallow copy, including first elem.
                                args.shift(); // remove 1st arg which is event.
                                WcEvent.setState(WcEvent.scriptState.running);
                                // set "me" property to owner of this script
                                WcInterpreter.me = itsMe;
                                var ret = false;
                                try {
                                    h.exec.apply(this, args);
                                } catch(e) {
                                    if (e instanceof WcException) {
                                        if (e.type === WcException.type.pass) {
                                            ret = true; // bubble up event
                                        } else {
                                            throw e; // re-throuw on other type to terminate script
                                        }
                                    } else {
                                        throw e; // re-throw if not WcException
                                    }
                                } finally {
                                    DomOp.sync();
                                    WcEvent.setState(WcEvent.scriptState.idle);
                                }
                                return ret;
                            }
                        });
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    console.error("Unknown Event: " + handler.name);
                }
//                $(elemId).on(handler.name + '.talk', handler.exec);
            }
        }
        // test
//        console.log(jQuery._data($(elemId)[0], 'events'));
    },
    edit: function() {
        //! todo: think of multiple script editing
        WcStorage.local.save(editKey, this.script);
        var objName = (this.owner.name()) ? ('"' + this.owner.name() + '"') : ('ID ' + this.owner.id());
        if ('partType' in this.owner.properties) {
            switch (this.owner.partType()) {
                case WcPart.type.button:
                    objName = 'Button ' + objName;
                    break;
                case WcPart.type.field:
                    objName = 'Field ' + objName;
                    break;
                default:
                    console.error('Unknown part type: ' + this.owner.partType());
            }
        } else { // should be WcContainer type
            switch(this.owner.containerType()) {
                case WcContainer.type.card:
                    objName = 'Card ' + objName;
                    break;
                case WcContainer.type.bg:
                    objName = 'Background ' + objName;
                    break;
                case WcContainer.type.stack:
                    objName = 'Stack ' + objName;
                    break;
                default:
                    console.error('Unknown container type: ' + this.owner.containerType());
            }
        }
        WcStorage.local.save(WcStorage.keys.editObject, objName);
        var that = this;
        var callback = function(ev) {
            var oldVal = ev.oldValue;
            var newVal = ev.newValue;
            var sArea = ev.storageArea;
            var key = ev.key;
            var url = ev.url;
            if (key === editKey) {
                that.setScript(newVal);
                DomOp.sync();
            }
        };
        var idx = WcStorage.local.register(callback);
        var wnd = window.open('script.html', null, 'top=100, left=100, width=640, height=640, menubar=no, toolbar=no, location=no, status=no, resizable=yes, scrollbars=yes');
        //! fixme find a better way to detect child window closed
        var timer = setInterval(function() {
            if (wnd.closed) {
                clearInterval(timer);
                WcStorage.local.unregister(idx);
                WcStorage.local.remove(editKey);
                DomOp.sync();
            }
        }, 1000);
        return;
    },
};

export default WcScript;
