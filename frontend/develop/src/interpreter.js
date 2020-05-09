/*!
 * WebCard script interpreter
 */

import 'jquery-sendkeys'; // make type command to appear text on input/textarea
import _ from 'lodash';
import WcMode from './mode.js';
import WcException from './exception';
import WcEvent from './event.js';
import WcContainer from './container.js';
import WcModal from './modal.js';
import WcTool from './tool.js';
import WcGlobal from './global.js';
import WcPaint from './paint.js';
import WcMenu from './menu.js';
import WcParser from './talk.js';
import StackOp from './stack.js';
import DomOp from './dom.js';
import WcSound from './sound.js';
import WcPart from './part.js';

const tickInMiliSec = 1 / 60 * 1000; // 1/60 sec to mili sec
const EMPTY = ""; // value of empty.
var containerFrameId;
// helper funcs
function evalConstant(expr) {
    switch(expr.constant) {
        case 'true': return true;
        case 'false': return false;
        //case 'empty': return ""; // fixme: or null?
        case 'empty': return EMPTY; // fixme: or null?
        case 'quote': return "'";
        case 'return': return '\n'; // hum. what about \r\n or \r?
        case 'space': return ' ';
        case 'tab': return '\t';
        case 'colon': return ':';
        case 'comma': return ',';
        case 'pi': return Math.PI;
        default:
        // "up", "down" handled here.
            return expr.constant;
    }
}

// if newVal arg is not null, set the property
function accessProperty(expr, newVal) {
    var val = null;
    if (!expr.property) {
        return val;
    }

    // assume 'scope' member if its property
    if (typeof expr.scope === 'object') {
        if (_.has(expr.scope, 'part')) {
            var part = StackOp.getPart(expr.scope);
            if (part) {
                // check property exists
                if (expr.property in part) {
                    val = part[expr.property](newVal);
                } else {
                    console.error("No property: " + expr.property + " in part object id " + part.id());
                    val = null;
                }
            }
        } else if (_.has(expr.scope, 'frame')) {
            var frame = StackOp.getFrame(expr.scope);
            if (frame) {
                // check property exists
                if (expr.property in frame) {
                    val = frame[expr.property](newVal);
                } else {
                    console.error("No property: " + expr.property + " in frame object id " + frame.id());
                    val = null;
                }
            }
        }
    }
    if (typeof expr.scope === 'string') {
        switch(expr.scope) {
            case 'global': {
                val = WcGlobal[expr.property](newVal);
                break;
            }
            case 'painting': {
                val = WcPaint.properties[expr.property](newVal);
                break;
            }
            case 'me': {
                var obj = interpreterInstance.me;
                if (obj) {
                    if (expr.property in obj) {
                        val = obj[expr.property](newVal);
                    } else {
                        console.error("No property: " + expr.property + " in object id " + obj.id());
                        val = null;
                    }
                }
                break;
            }
            default: {
                console.log(expr.scope);
                break;
            }
        }
    }
    if (typeof val === 'object') {
        val = val.interpret(newVal);
    }
    return val;
}

// here, container is object which holds text.
function getChunk(txt, json) {
    var chunk = txt;
    var ret;
    if ((!json) || (!json.chunk)) {
        return chunk;
    }
    // single chunk
    if ('at' in json) {
        var idx = parseInt(json.at);
        ret = accessChunkAt(chunk, json, idx, false);
    }
    if ('pointer' in json) {
        switch(json.pointer) {
            case 'first': ret = accessChunkAt(chunk, json, 1, false); break;
            case 'second': ret = accessChunkAt(chunk, json, 2, false); break;
            case 'third': ret = accessChunkAt(chunk, json, 3, false); break;
            case 'fourth': ret = accessChunkAt(chunk, json, 4, false); break;
            case 'fifth': ret = accessChunkAt(chunk, json, 5, false); break;
            case 'sixth': ret = accessChunkAt(chunk, json, 6, false); break;
            case 'seventh': ret = accessChunkAt(chunk, json, 7, false); break;
            case 'eighth': ret = accessChunkAt(chunk, json, 8, false); break;
            case 'ninth': ret = accessChunkAt(chunk, json, 9, false); break;
            case 'tenth': ret = accessChunkAt(chunk, json, 10, false); break;
            case 'last': ret = accessChunkAt(chunk, json, 'last', false); break;
        }
    }
    // range of chunk
    if ('start' in json) {
        var start = parseInt(json.start);
        var end = parseInt(json.end);
        ret = accessChunkRange(chunk, json, start, end, false);
    }
    // do call recursive to handle the nesting. it's breath first
    if ('inner' in json) {
        chunk = getChunk(ret.chunk, json.inner);
    } else {
        chunk = ret.chunk;
    }
    return chunk;
}

function readFromContainer(json) {
    // assume json has 'container' member
    switch (json.container) {
        case 'it': return interpreterInstance.it;
        case 'message box': return WcEvent.message.read();
        //case 'clipboard': 
        case 'field': {
            var fld = StackOp.getField(json.field);
            var chunk = getChunk(fld.text(), json.field.chunk);
            return chunk;
        }
        //case 'menuBar':
        //case 'menuItem':
    }
}

function accessChunkAt(txt, json, idx, replace, pos, val) {
    var ret = { chunk: "", index: 0, length: 0 };
    var chunk = "";
    var arr = null;
    var delim = '';
    var at = 0;
    var idxChar = (idx === 'last') ? txt.length : idx;
    switch(json.chunk) {
        case 'char': {
            if (idxChar <= txt.length) {
                ret.index = idxChar - 1; // talk script index starts with 1.
                ret.length = 1;
                chunk = txt.charAt(idxChar - 1);
                if (replace) {
                    switch(pos) {
                        case 'into': chunk = val; break;
                        case 'before': chunk = val + chunk; break;
                        case 'after': chunk = chunk + val; break;
                    }
                }
                ret.chunk = chunk;
                //ret.chunk = (replace) ? val : txt.charAt(idxChar - 1);
            } else {
                ret.index = txt.length;
                ret.length = 0;
                // expand txt data                
                if (replace) {
                    for (var i = txt.length; i < idxChar - 1; i++) {
                        chunk = chunk + ' ';
                    }
                    chunk = chunk + val; // dont account pos into/before/after
                }
                ret.chunk = chunk;
            }
            break;
        }
        case 'item': arr = txt.split(','); break;
        case 'line': arr = txt.split(/\n|\r|\r\n/); break;
        case 'word': arr = txt.split(/\s+/); break;
    }
    if (arr) {
        if (idx === 'last') { // handle special case
            idx = arr.length;
        }
        if (arr.length > 1) {
            // assume form of "text[delimiter]text" if array has more than 1 element
            delim = txt.slice(arr[0].length, txt.indexOf(arr[1]));
        } else {
            //! todo: re-think case of empty or only one element in fld.text and no delim...
            switch(json.chunk) {
                case 'item': delim = ','; break;
                case 'line': delim = '\n'; break; // what about \r or \r\n ?
                case 'word': delim = ' '; break; // what about multiple space -> \s+ match to one delim ?
            }
        }
        if (idx <= arr.length) {
            for (var i = 0; i < idx; i++) {
                at = txt.indexOf(arr[i], at);
                // handle case where arr[i] is ""
                if (!arr[i]) {
                    if (i > 0) {
                        at = at + arr[i - 1].length; // add previous elem size
                    }
                    at = at + delim.length;
                }
            }
            ret.index = at;
            ret.length = arr[idx - 1].length;
            chunk = arr[idx - 1];
            if (replace) {
                switch(pos) {
                    case 'into': chunk = val; break;
                    case 'before': chunk = val + chunk; break;
                    case 'after': chunk = chunk + val; break;
                }
            }
            ret.chunk = chunk;
        } else {
            if (replace) {
                // expand txt data
                for (var i = arr.length; i < idx; i++) {
                    chunk = chunk + delim;
                }
                chunk = chunk + val; // dont account pos into/before/after
            }
            ret.index = txt.length;
            ret.length = 0; // nothing to cut
            ret.chunk = chunk;
        }
    }
    return ret;
}

function accessChunkRange(txt, json, start, end, replace, pos, val) {
    var ret = { chunk: "", index: 0, length: 0 };
    var arr = null;
    var chunk = "";
    var delim = '';
    var from = 0;
    var to = 0;
    switch(json.chunk) {
        case 'char': {
            if (end <= txt.length) {
                ret.index = start - 1; // talk script index starts with 1.
                ret.length = end - start + 1; // include both ends

                chunk = txt.slice(start - 1, end);
                if (replace) {
                    switch(pos) {
                        case 'into': chunk = val; break;
                        case 'before': chunk = val + chunk; break;
                        case 'after': chunk = chunk + val; break;
                    }
                }
                ret.chunk = chunk;
            } else {
                ret.index = (start - 1 < txt.length) ? (start - 1) : txt.length;
                ret.length = (start - 1 < txt.length) ? (txt.length - start + 1) : 0;
                for (var i = txt.length; i < start - 1; i++) {
                    chunk = chunk + ' ';
                }
                chunk = chunk + val;
                ret.chunk = (replace) ? chunk : "";
            }
            break;
        }
        case 'item': arr = txt.split(','); break;
        case 'line': arr = txt.split(/\n|\r|\r\n/); break;
        case 'word': arr = txt.split(/\s+/); break;
    }
    if (arr) {
        if (arr.length > 1) {
            // assume form of "text[delimiter]text" if array has more than 1 element
            delim = txt.slice(arr[0].length, txt.indexOf(arr[1]));
        } else {
            //! todo: re-think case of empty or only one element in fld.text and no delim...
            switch(json.chunk) {
                case 'item': delim = ','; break;
                case 'line': delim = '\n'; break; // what about \r or \r\n ?
                case 'word': delim = ' '; break; // what about multiple space -> \s+ match to one delim ?
            }
        }
        for (var i = 0; i < start; i++) {
            from = txt.indexOf(arr[i], from);
            // handle case where arr[i] is ""
            if (!arr[i]) {
                if (i > 0) {
                    from = from + arr[i - 1].length; // add previous elem size
                }
                from = from + delim.length;
            }
        }
        if (arr.length < start) {
            from = txt.length;
        }
        if (replace) {
            // fill each item with same value
            switch(pos) {
                case 'into': {
                    chunk = val;
                    for (var i = start; i < end; i++) {
                        chunk = chunk + delim + val;
                    }
                    break;
                }
                case 'before': {
                    chunk = val + ((start < arr.length) ? arr[start - 1] : '');
                    for (var i = start; i < end; i++) {
                        if (i < arr.length) {
                            chunk = chunk + delim + val + arr[i];
                        } else {
                            chunk = chunk + delim + val;
                        }
                    }
                    break;
                }
                case 'after': {
                    chunk = ((start < arr.length) ? arr[start - 1] : '') + val;
                    for (var i = start; i < end; i++) {
                        if (i < arr.length) {
                            chunk = chunk + delim + arr[i] + val;
                        } else {
                            chunk = chunk + delim + val;
                        }
                    }
                    break;
                }
            }
        }
        if (end <= arr.length) {
            // also find the end index of txt
            for (var i = 0; i < end; i++) {
                to = txt.indexOf(arr[i], to);
                // handle case where arr[i] is ""
                if (!arr[i]) {
                    if (i > 0) {
                        to = to + arr[i - 1].length; // add previous elem size
                    }
                    to = to + delim.length;
                }
            }
            to = to + arr[end - 1].length; // to points to end of end item
            ret.index = from;
            ret.length = to - from;
            ret.chunk = (replace) ? chunk : txt.slice(from, to);
        } else { // end exeeds item length of arr
            ret.index = from;
            ret.length = txt.length - from;
            ret.chunk = (replace) ? chunk : txt.slice(from, txt.length);
        }
    }
    return ret;
}

function putChunk(txt, json, val, pos) {
    var ret = { chunk: "", index: 0, length: 0 };
    if ((!json) || !(json.chunk)) {
        return val;
    }
    var replace = ('inner' in json) ? false : true; // replace to val if no more inner
    // single chunk
    if ('at' in json) {
        var idx = parseInt(json.at);
        ret = accessChunkAt(txt, json, idx, replace, pos, val);
    }
    if ('pointer' in json) {
        switch(json.pointer) {
            case 'first': ret = accessChunkAt(txt, json, 1, replace, pos, val); break;
            case 'second': ret = accessChunkAt(txt, json, 2, replace, pos, val); break;
            case 'third': ret = accessChunkAt(txt, json, 3, replace, pos, val); break;
            case 'fourth': ret = accessChunkAt(txt, json, 4, replace, pos, val); break;
            case 'fifth': ret = accessChunkAt(txt, json, 5, replace, pos, val); break;
            case 'sixth': ret = accessChunkAt(txt, json, 6, replace, pos, val); break;
            case 'seventh': ret = accessChunkAt(txt, json, 7, replace, pos, val); break;
            case 'eighth': ret = accessChunkAt(txt, json, 8, replace, pos, val); break;
            case 'ninth': ret = accessChunkAt(txt, json, 9, replace, pos, val); break;
            case 'tenth': ret = accessChunkAt(txt, json, 10, replace, pos, val); break;
            case 'last': ret = accessChunkAt(txt, json, 'last', replace, pos, val); break;
        }
    }
    // range of chunk
    if ('start' in json) {
        var start = parseInt(json.start);
        var end = parseInt(json.end);
        ret = accessChunkRange(txt, json, start, end, replace, pos, val);
    }
    // do call recursive to handle the nesting. it's breath first
    var chunk = "";
    if ('inner' in json) {
        chunk = putChunk(ret.chunk, json.inner, val, pos);
        // concatinate
        chunk = txt.slice(0, ret.index) + chunk + txt.slice(ret.index + ret.length);
    } else {
        // concatinate
        chunk = txt.slice(0, ret.index) + ret.chunk + txt.slice(ret.index + ret.length);
    }
    return chunk;
}

function writeToContainer(json, val, pos) {
    // assume json has 'container' member
    switch (json.container) {
        case 'it': {
            switch (pos) {
                case 'into': interpreterInstance.it = val; return;
                case 'before': interpreterInstance.it = val + interpreterInstance.it; return;
                case 'after': interpreterInstance.it = interpreterInstance.it + val; return;
            }
        }
        case 'message box': {
            var msgtxt = WcEvent.message.read();
            switch (pos) {
                case 'into': WcEvent.message.write(val); return;
                case 'before': WcEvent.message.write(val + msgtxt); return;
                case 'after': WcEvent.message.write(msgtxt + val); return;
            }
        }
        // case 'clipboard': 
        case 'field': {
            var fld = StackOp.getField(json.field);
            if (fld) {
                fld.text(putChunk(fld.text(), json.field.chunk, val, pos));
            }
        }
        // case 'menuBar': 
        // case 'menuItem': 
    }
}

function checkAndStopInEmergency() {
    if (WcEvent.checkEmergency()) {
        var stopMe = new WcException({
            type: WcException.type.emergency,
            msg: "Script term by Ctrl + . command"
        });
        throw stopMe;
    }
}

// singleton
var interpreterInstance;
function WcInterpreter() {
    if (typeof interpreterInstance === 'object') {
        return interpreterInstance;
    }
    this.it = null;
    this.me = null;
    this.result = EMPTY;
    this.params = null;
    this.cardStack = [];
    this.openedApps = [];
    interpreterInstance = this;
}
WcInterpreter.prototype = {
    constructor: WcInterpreter,
    setup: function(frameId) {
        // to show on global scope for script exec funcs. fixme: find better way of scoping...
        window.WcInterpreter = interpreterInstance;
        containerFrameId = frameId;
    },
    commands: {
        go: function(args) {
            var frame = StackOp.getFrame(args);
            if (frame) {
                StackOp.gotoFrame(frame);
                DomOp.update();
                interpreterInstance.result = EMPTY;
            } else {
                interpreterInstance.result = "No such card to go to";
            }
        },
        push: function(args) {
            // note: push does not acctually move to the specified frame.
            var frame = StackOp.getFrame(args);
            if (frame) {
                StackOp.pushFrame(frame);
            }
        },
        pop: function(args) {
            var frame = StackOp.popFrame();
            if (frame) {
                if (!args) {
                    // go directly to that frame
                    StackOp.gotoFrame(frame);
                } else {
                    // put info into args container
                    var frameInfo = frame.id();
                    switch(frame.containerType()) {
                        case WcContainer.type.card: frameInfo = 'card id ' + frameInfo; break;
                        case WcContainer.type.bg: frameInfo = 'background id ' + frameInfo; break;
                        case WcContainer.type.stack: frameInfo = 'stack id ' + frameInfo; break;
                    }
                    writeToContainer(args, frameInfo, args.pos);
                }
            } else {
                // !todo: if poped more than push, go to home stack...
            }
            DomOp.update();
        },
        help: function() {
            WcEvent.fire(WcEvent.systemMessages.help);
        },
        open: function(args) {
            // !fixme revisit todo: I don't think opening native app is possible from browser, but instead
            // it can open file like localhost:8080/memo.txt or http://www.google.com. should we allow this?
            // need to check opening file like "C:\\myprog.bat"
            var wnd;
            var name = ('file' in args) ? args.file : args.app;
            if ('file' in args) {
                wnd = window.open(args.file);
            } else { // args.app is always specified
                wnd = window.open(args.app);
            }
            if (wnd) {
                interpreterInstance.openedApps.push({
                    wnd: wnd, name: name });
            }
        },
        close: function(args) {
            var app;
            var name = ('file' in args) ? args.file : args.app;
            app = _.find(interpreterInstance.openedApps, function(a) {
                return a.name === name;
            });
            if (app) {
                if (!app.wnd.closed) {
                    app.wnd.close();
                }
                var idx = interpreterInstance.openedApps.indexOf(app);
                interpreterInstance.openedApps.splice(idx, 1); // remove this app
            }
        },
        lockRecent: function() {
            this.set({ property: "lockRecent", scope: "global", value: true });
        },
        unlockRecent: function() {
            this.set({ property: "lockRecent", scope: "global", value: false });
        },
        answerProgram: function(args) {
            alert("No way to prompt installed program list as dialog box from browser...");
            // hey, <a href="tel:xxx">phone number</a> will open dialog to choose application!
            // humm. below only lists phone related apps only...
            // window.open("tel:01234567890");
        },
        arrowKey: function(args) {
            WcEvent.fire(WcEvent.systemMessages.arrowKey, args.arrow);
        },
        put: function(args) {
            // put some text to container
            if ('container' in args) {
                writeToContainer(args, args.expr, args.pos);
            }
            // put something to variable. since it's in form of var = put(...), so just return it.
            if ('var' in args) {
                switch(args.pos) {
                    case 'into': return args.expr;
                    case 'before': return args.expr + args.var;
                    case 'after': return args.var + args.expr;
                }
            }
            // DomOp.sync(); // synced at end of script
        },
        delete: function(args) {
            var part = StackOp.getPart(args);
            if (part) {
                StackOp.deletePart(part);
                DomOp.update();
            }
            // also handle delete menu item and menu bar
        },
        enable: function(args) {
            // only btn, menubar, menuitem has enabled property (field does not have!)
            var btn = StackOp.getButton(args);
            if (btn) {
                btn.enabled(true);
                //DomOp.sync();
            }
            // also handle enable menu item and menu bar
        },
        disable: function(args) {
            // only btn, menubar, menuitem has enabled property (field does not have!)
            var btn = StackOp.getButton(args);
            if (btn) {
                btn.enabled(false);
                //DomOp.sync();
            }
            // also handle enable menu item and menu bar
        },
        selectObject: function(args) {
            var part = StackOp.getPart(args);
            if (part) {
                // check part is in current frame, and not hidden!
                if (part.visible() !== true)
                    return;
                var frame = part.owner();
                var comp = null;
                switch(frame.containerType()) {
                    case WcContainer.type.card: comp = StackOp.currentCard(); break;
                    case WcContainer.type.bg: comp = StackOp.currentBg(); break;
                    case WcContainer.type.stack: comp = StackOp.currentStack; break;
                }
                if (comp !== frame)
                    return;
                // from HyperTalk reference, select btn/fld says: "you had chosen btn/fld tool and clicked it"
                // so change to edit mode. (really? need to revisit...)
                WcMode.setMode(WcMode.modes.edit);
                var elem = DomOp.getPartElement(part);
                if (elem.length > 0) {
                    elem.focus();
                    elem.click();
                }
                //DomOp.update(); // this will remove above focus(). dont call update().
            }
        },
        selectText: function(args) {
            var fld = StackOp.getField(args);
            if (fld) {
                var elem = DomOp.getPartElement(fld);
                if (elem.length > 0) {
                    // !todo: !fixme: handle chunk of field select.
                    var textArea = elem.find(':first-child')[0];
                    if ('createTextRange' in textArea) {
                        var range = textArea.createTextRange();
                        range.collapse(true);
                        range.moveStart('character', 0);
                        range.moveEnd('character', fld.text().length);
                        range.select();
                        range.focus();
                    }
                    if ('setSelectionRange' in textArea) {
                        textArea.focus();
                        textArea.setSelectionRange(0, fld.text().length);
                    }
                    if ('selectionStart' in textArea && typeof textArea.selectionStart != 'undefined') {
                        textArea.selectionStart = 0;
                        textArea.selectionEnd = fld.text().length;
                        textArea.focus();
                    }
                }
            }
        },
        dial: function(args) {
            // !todo: remove hiphen (-) if any...
            // window.open('tel:' + args.number).close();
            window.open('tel:' + args.number); // humm. 
            // or is making <a href="tel:xxx"> tag and hit it better?
        },
        choose: function(args) {
            var param = WcTool.makeChooseParam(args);
            WcEvent.fire(WcEvent.systemMessages.choose, param);
        },
        click: function(args) {
//            var x = parseInt($(containerFrameId).offset().left) + parseInt(args.x);
//            var y = parseInt($(containerFrameId).offset().top) + parseInt(args.y);
            var loc;
            if ('loc' in args) {
                loc = [parseInt(args.loc.x), parseInt(args.loc.y)];
            }
            if ('expr' in args) {
                loc = args.expr.split(',').map(function(i) { return parseInt(i.trim()); });
            }
            if (loc.length !== 2 || isNaN(loc[0]) || isNaN(loc[1])) {
                return;
            }
            var x = parseInt($(containerFrameId).offset().left) + (loc[0]);
            var y = parseInt($(containerFrameId).offset().top) + (loc[1]);
            var elem = document.elementFromPoint(x, y);
            var evdown = jQuery.Event('mousedown', { pageX: x, pageY: y, ctrlKey: false, shiftKey: false, altKey: false });
            var evup = jQuery.Event('mouseup', { pageX: x, pageY: y, ctrlKey: false, shiftKey: false, altKey: false });
            var evclick = jQuery.Event('click', { pageX: x, pageY: y, ctrlKey: false, shiftKey: false, altKey: false });
            // map and set modifier keys
            if ('keys' in args) {
                for (var i = 0; i < args.keys.length; i++) {
                    switch(args.keys[i]) {
                        case 'commandKey': evclick.ctrlKey = evup.ctrlKey = evdown.ctrlKey = true; break;
                        case 'shiftKey': evclick.shiftKey = evup.shiftKey = evdown.shiftKey = true; break;
                        case 'optionKey': evclick.altKey = evup.altKey = evdown.altKey = true; break;
                    }
                }
            }
            // fire event to elem
            $('#' + elem.id)
                .trigger(evdown)
                .trigger(evup)
                .trigger(evclick)
            ;
            // !todo also update the mouseLoc property...
        },
        drag: function(args) {
            var loc1;
            var loc2;
            if ('loc1' in args) {
                loc1 = [parseInt(args.loc1.x), parseInt(args.loc1.y)];
            }
            if ('loc2' in args) {
                loc2 = [parseInt(args.loc2.x), parseInt(args.loc2.y)];
            }
            if ('expr1' in args) {
                loc1 = args.expr1.split(',').map(function(i) { return parseInt(i.trim()); });
            }
            if ('expr2' in args) {
                loc2 = args.expr2.split(',').map(function(i) { return parseInt(i.trim()); });
            }
            var x0 = parseInt($(containerFrameId).offset().left) + (loc1[0]);
            var y0 = parseInt($(containerFrameId).offset().top) + (loc1[1]);
            var x1 = parseInt($(containerFrameId).offset().left) + (loc2[0]);
            var y1 = parseInt($(containerFrameId).offset().top) + (loc2[1]);
            var elem0 = document.elementFromPoint(x0, y0);
            var elem1 = document.elementFromPoint(x1, y1);
            var evdown = jQuery.Event('mousedown', { pageX: x0, pageY: y0, ctrlKey: false, shiftKey: false, altKey: false });
            var evmove = jQuery.Event('mousemove', { pageX: x1, pageY: y1, ctrlKey: false, shiftKey: false, altKey: false });
            var evleave = jQuery.Event('mouseleave', { pageX: x1, pageY: y1, ctrlKey: false, shiftKey: false, altKey: false });
            var evup = jQuery.Event('mouseup', { pageX: x1, pageY: y1, ctrlKey: false, shiftKey: false, altKey: false });
            var evclick = jQuery.Event('click', { pageX: x1, pageY: y1, ctrlKey: false, shiftKey: false, altKey: false });
            // map and set modifier keys
            if ('keys' in args) {
                for (var i = 0; i < args.keys.length; i++) {
                    switch(args.keys[i]) {
                        case 'commandKey': evclick.ctrlKey = evup.ctrlKey = evleave.ctrlKey = evmove.ctrlKey = evdown.ctrlKey = true; break;
                        case 'shiftKey': evclick.shiftKey = evup.shiftKey = evleave.shiftKey = evmove.shiftKey = evdown.shiftKey = true; break;
                        case 'optionKey': evclick.altKey = evup.altKey = evleave.altKey = evmove.altKey = evdown.altKey = true; break;
                    }
                }
            }
            // fire event to elem
            if (elem0.id == elem1.id) {
                $('#' + elem0.id)
                    .trigger(evdown)
                    .trigger(evmove)
                    .trigger(evup)
                    .trigger(evclick)
                ;
            } else {
                // !todo: check below event dispatch is correct.
                $('#' + elem0.id)
                    .trigger(evdown)
                    .trigger(evmove)
                    .trigger(evleave)
                ;
                $('#' + elem1.id)
                    .trigger(evmove)
                    .trigger(evup)
                //    .trigger(evclick)
                ;
            }
        },
        type: function(args) {
            var evkeydown = jQuery.Event('keydown', { ctrlKey: false, shiftKey: false, altKey: false });
            // map and set modifier keys
            if ('keys' in args) {
                for (var i = 0; i < args.keys.length; i++) {
                    switch(args.keys[i]) {
                        case 'commandKey': evkeydown.ctrlKey = true; break;
                        case 'shiftKey': evkeydown.shiftKey = true; break;
                        case 'optionKey': evkeydown.altKey = true; break;
                    }
                }
            }
            // fire to element with focus
            var focus = $(document.activeElement); // $(':focus');
            if (focus.length < 1) {
                focus = $(document); // fire to document if there is no focus
            }
            for (var i = 0; i < args.text.length; i++) {
                evkeydown.which = evkeydown.keyCode = args.text[i].toUpperCase().charCodeAt(0);
                evkeydown.key = args.text[i];
                focus.trigger(evkeydown);
                //focus.sendkeys(args.text[i]); // above keydown trigger will do
            }
        },
        //! todo: skip sound commands for now, revisit later
        beep: function(args) {
            WcSound.beep(parseInt(args.count));
        },
        play: undefined,
        playStop: undefined,
        stopSound: undefined,
        speak: undefined,
        stopSpeech: undefined,
        debugSound: undefined,
        // arithmetic ops with variables are already processed in parser. Just handle container expr
        add: function(args) {
            var val = Number(readFromContainer(args.dest));
            val = val + Number(args.value);
            writeToContainer(args.dest, val, 'into');
            //DomOp.sync();
        },
        subtract: function(args) {
            var val = Number(readFromContainer(args.dest));
            val = val - Number(args.value);
            writeToContainer(args.dest, val, 'into');
            //DomOp.sync();
        },
        multiply: function(args) {
            var val = Number(readFromContainer(args.dest));
            val = val * Number(args.value);
            writeToContainer(args.dest, val, 'into');
            //DomOp.sync();
        },
        divide: function(args) {
            var val = Number(readFromContainer(args.dest));
            val = val / Number(args.value);
            writeToContainer(args.dest, val, 'into');
            //DomOp.sync();
        },
        //! todo: skip search commands for now, revisit later
        find: undefined,
        findWhole: undefined,
        findWord: undefined,
        findChars: undefined,
        findString: undefined,
        sortCards: undefined,
        sortItems: undefined,
        sortLines: undefined,
        mark: undefined,
        markCardsWhere: undefined,
        markCardsByFinding: undefined,
        markAllCards: undefined,
        unmark: undefined,
        unmarkCardsWhere: undefined,
        unmarkCardsByFinding: undefined,
        unmarkAllCards: undefined,
        goMarkedCard: undefined,
        //! todo: skip visual effect for now, revisit later
        visual: undefined,
        flash: function(args) {
            var count = parseInt(args.count);
            var repeatFlash = function(c) {
                if (c <= 0) return;
                $(containerFrameId).fadeOut('fast', function() {
                    $(this).fadeIn('slow', function() {
                        repeatFlash(c - 1);
                    });
                });
            };
            repeatFlash(count);
        },
        answer: function(args) {
            var text = args.text;
            var choices = (args.choices) ? args.choices: ['OK'];
            // clear "it" variable where clicked answer is storeed
            interpreterInstance.it = null;
            //!todo: await modal here so it variable can be referenced
            /* await */ WcModal.answer(text, choices);
        },
        ask: function(args) {
            var text = args.text;
            var defo = (args.default) ? args.default : "";
            // clear "it" variable where clicked answer is storeed
            interpreterInstance.it = null;
            //!todo: await modal here so it variable can be referenced
            WcModal.ask(text, defo);
        },
        askPassword: function(args) {
            var text = args.text;
            var defo = (args.default) ? args.default : "";
            var plainText = (args.clear) ? true : false;
            // clear "it" variable where clicked answer is storeed
            interpreterInstance.it = null;
            //!todo: await modal here so it variable can be referenced
            WcModal.askPassword(text, defo, plainText);
        },
        lockScreen: function() {
            DomOp.lockScreen();
        },
        unlockScreen: function(args) {
            DomOp.unlockScreen(args);
        },
        get: function(args) {
            var val = accessProperty(args);
            // clear "it" variable where clicked answer is storeed
            interpreterInstance.it = val;
        },
        set: function(args) {
            var val;
            if ('value' in args) {
                val = args.value;
            }
            if ('loc' in args) {
                val = args.loc.x + ',' + args.loc.y;
            }
            accessProperty(args, val);
        },
        hide: function(args) {
            if ('part' in args) {
                var part = StackOp.getPart(args)
                if (part) part.visible(false);
            }
            if ('frame' in args) {
                var frame = StackOp.getFrame(args);
                if (frame) frame.showPict(false);
            }
            if ('object' in args) {
                switch (args.object) {
                    case 'message box': {
                        WcEvent.message.close();
                        break;
                    }
                    case 'menuBar': {
                        WcMenu.hide();
                        break;
                    }
                    case 'titleBar': { //! TBD
                        break;
                    }
                }
            }
            //DomOp.sync();
        },
        show: function(args) {
            if ('part' in args) {
                var part = StackOp.getPart(args)
                if (part) part.visible(true);
            }
            if ('frame' in args) {
                var frame = StackOp.getFrame(args);
                if (frame) frame.showPict(true);
            }
            if ('object' in args) {
                switch (args.object) {
                    case 'message box': {
                        WcEvent.message.open();
                        break;
                    }
                    case 'menuBar': {
                        WcMenu.show();
                        break;
                    }
                    case 'titleBar': { //! TBD
                        break;
                    }
                }
            }
            //DomOp.sync();
        },
        //! todo: revisit later. skip object and file manipulation commands for now.
        resetPaint: undefined,
        select: undefined,
        selectEmpty: undefined,
        selectLine: undefined,
        enterInField: undefined,
        openFile: undefined,
        closeFile: undefined,
        answerFile: undefined,
        askFile: undefined,
        read: undefined,
        write: undefined,
        print: undefined,
        doMenu: function(args) {
            var nodialog = (_.has(args, 'dialog')) ? !args.dialog : false;
            if (_.has(args, 'menubar')) {
                var bar = _.has(args.menubar, 'id') ? WcMenu.getMenuBar('id', args.menubar.id) : WcMenu.getMenuBar('name', args.menubar.expr);
                if (bar) {
                    for (var i in bar.menuItem) {
                        var item = bar.menuItem[i];
                        if (item.name === args.expr) {
                            item.callback(nodialog);
                            break;
                        }
                    }
                }
            } else {
                var item = WcMenu.getMenuItem('name', args.expr);
                if (item) {
                    item.callback(nodialog);
                }
            }
        },
        //! todo: revisit later. skip other menu commands
        createMenu: undefined,
        resetMenubar: undefined,
        //! todo: revisit later. skip printing commands
        openPrinting: undefined,
        openReportPrinting: undefined,
        closePrinting: undefined,
        printCard: undefined,
        printCards: undefined,
        printMarkedCard: undefined,
        resetPrinting: undefined,
        wait: function(args) { //! fixme: find better way than busy loop...
            if (_.has(args, 'condition')) {
                // under construction. not workin yet...
                console.log(args);
                var pause;
                switch(args.condition) {
                    case 'until': {
                        pause = function() { console.log("pause");
                            if (args.expr) { console.log("release");
                                return; }
                            setTimeout(pause, parseInt(tickInMiliSec));
                        }
                        break;
                    }
                    case 'while': {
                        pause = function() { console.log("released");
                            if (!args.expr) { console.log("paused");
                                return; }
                            setTimeout(pause, parseInt(tickInMiliSec));
                        }
                        break;
                    }
                }
                pause();
                return;
            }
            var milisec;
            var time = parseInt(args.expr);
            if (!time) return;
            switch(args.unit) {
                case 'seconds': milisec = time * 1000; break;
                case 'ticks': milisec = time * (1/60) * 1000; break;
                default: return;
            }
            milisec = parseInt(milisec);
            /*
            var ticksToWait = parseInt(milisec / tickInMiliSec);
            var waitTicks = function() {
                if (ticksToWait < 0) {
                    return;
                } else {
                    ticksToWait--;
                    console.log("setTimeout");
                    setTimeout(waitTicks, tickInMiliSec);
                }

            };
            console.log(ticksToWait);
            waitTicks();
            */
            var now = Date.now(); // its in milisec
            var tilthen = now + milisec;
            while (Date.now() < tilthen) {
                ; // bad. busy loop...
                checkAndStopInEmergency(); //! fixme: not working. Ctrl+. event not catched in busy while loop.
            }
        },
        exitToHyperCard: function() {
            var exit = new WcException({
                type: WcException.type.exit,
                msg: "exit to HyperCard command executed"
            });
            throw exit;
        },
        lockMessages: function() {
            this.set({ property: "lockMessages", scope: "global", value: true });
        },
        unlockMessages: function() {
            this.set({ property: "lockMessages", scope: "global", value: false });
        },
        lockErrorDialogs: function() {
            this.set({ property: "lockErrorDialogs", scope: "global", value: true });
        },
        unlockErrorDialogs: function() {
            this.set({ property: "lockErrorDialogs", scope: "global", value: false });
        },
        startUsing: undefined, //! fixme: currently multiple stack is not supported
        stopUsing: undefined, //! fixme: currently multiple stack is not supported
        debugCheckpoint: undefined, //! fixme: not debugger currently available
        magic: function() {
            this.set({ property: "userLevel", scope: "global", value: 5 });
        },
        closeWindow: undefined, //! fixme: currently multiple window is not supported
        commandKeyDown: function(args) {
            var key = args.expr;
            WcEvent.fire(WcEvent.systemMessages.commandKeyDown, key);
        },
        controlKey: function(args) {
            var key = args.expr;
            WcEvent.fire(WcEvent.systemMessages.controlKey, key);
        },
        enterKey: function() {
            WcEvent.fire(WcEvent.systemMessages.enterKey);
        },
        returnKey: function() {
            WcEvent.fire(WcEvent.systemMessages.returnKey);
        },
        tabKey: function() {
            WcEvent.fire(WcEvent.systemMessages.tabKey);
        },
        pass: function() {
            var pass = new WcException({
                type: WcException.type.pass,
                msg: "pass command executed"
            });
            throw pass; // catch me and handle in script handler execution!
        },
        do: function(args) {
            var cmds;
            if ('container' in args) {
                cmds = readFromContainer(args);
            }
            if ('variable' in args) {
                cmds = args.variable;
            }
            if ('string' in args) {
                cmds = args.string;
            }
            // parse and execute commands
            var func = 'function f \n' + cmds + '\nend f'; // wrap so it will be function handler
            var result = WcParser.parser.parse(func);
            if ($.isArray(result)) {
                // run instant script immediately
                result[0].exec();
            } else {
                // parse error...
            }
        },
        send: function(args) { //! send does not take arg for message... "send arrowKey right to cd 1" will not parse...
            var msg = args.message;
            if (!(msg in WcEvent.systemMessages)) {
                return;
            }
            var obj = null;
            if ('part' in args.object) {
                obj = StackOp.getPart(args.object);
            } else if ('frame' in args.object) {
                obj = StackOp.getFrame(args.object);
            }
            if (obj) {
                var old = interpreterInstance.me;
                var handlers = obj.script().getHandlers();
                for (var idx in handlers) {
                    var handler = handlers[idx];
                    if (handler.type === 'handler') {
                        if (handler.name === msg) {
                            try {
                                interpreterInstance.me = obj; // swap 'me' prop to new object
                                handler.exec();
                            } catch (e) {
                                if (e instanceof WcException) {
                                    ; // ignore pass or exit and just run rest of caller's script
                                } else { // re-throw error
                                    throw e;
                                }
                            } finally {
                                interpreterInstance.me = old;
                            }
                        }
                    }
                }
            }
        },
    },
    builtins: {
        date: function() { //! the <adj> date, where adj is short/long/abbreviated. default to short
            var now = new Date();
            return now.toLocaleDateString();
        },
        time: function() { //! the <adj> date, where adj is short/long/abbreviated. default to short
            var now = new Date();
            return now.toLocaleTimeString();
        },
        seconds: function() {
            var now = new Date();
            return parseInt(now.getTime() / 1000); // convert milisec to seconds
        },
        ticks: function() {
            var now = new Date();
            return parseInt(now.getTime() / tickInMiliSec); // convert milisec to seconds
        },
        mouseH: function() {
            return WcEvent.mouseY();
        },
        mouseV: function() {
            return WcEvent.mouseX();
        },
        mouseLoc: function(args) {
            var loc = this.mouseV() + ',' + this.mouseH();
            return getChunk(loc, (args) ? args.chunk : undefined);
        },
        commandKey: function() {
            return WcEvent.commandKey();
        },
        optionKey: function() {
            return WcEvent.optionKey();
        },
        shiftKey: function() {
            return WcEvent.shiftKey();
        },
        //! todo: revisit. controlKey function is not there in HyperCard. add to parser to start.
        controlKey: function() {
            return WcEvent.controlKey();
        },
        mouse: function() {
            return WcEvent.mouse();
        },
        mouseClick: function() {
            return WcEvent.mouseClick();
        },
        clickH: function() {
            return WcEvent.clickH();
        },
        clickV: function() {
            return WcEvent.clickV();
        },
        clickLoc: function(args) {
            var loc = this.clickV() + ',' + this.clickH();
            return getChunk(loc, (args) ? args.chunk : undefined);
        },
        length: function(args) {
            if (typeof args.expr === 'string') {
                return args.expr.length;
            } else {
                return -1;
            }
        },
        //! fixme : field, which is textarea needs selectionStart attr handling. do it later.
        clickChunk: undefined,
        clickLine: undefined,
        clickText: undefined,
        selectedText: undefined,
        selectedChunk: undefined,
        selectedLine: undefined,
        selectedField: undefined,
        selectedLoc: undefined,
        selectedLineOf: undefined,
        foundText: undefined,
        foundChunk: undefined,
        foundLine: undefined,
        foundField: undefined,
        charToNum: function(args) {
            if (typeof args.expr === 'string') {
                var asciiCode = args.expr.charCodeAt(0);
                return asciiCode;
            }
            return -1;
        },
        numToChar: function(args) {
            if (args.expr) {
                var num = args.expr;
                if (typeof num === 'string') num = parseInt(num);
                if (!isNaN(num)) {
                    return String.fromCharCode(num);
                }
            }
            return -1;
        },
        offset: function(args) {
            var offset = -1;
            if ((typeof args.needle === 'string') && (typeof args.haystack === 'string')) {
                offset = args.haystack.search(args.needle);
            }
            return offset;
        },
        random: function(args) { // return random of 1 .. max integer. random(6) will give 1..6
            var max = args.expr;
            max = parseInt(max);
            if (!isNaN(max)) {
                var rand = Math.floor(Math.random() * Math.floor(max));
                rand += 1; // range is [1..max]. shift by 1.
                return rand;
            }
            return null;
        },
        sum: function() {
            var total = null;
            for (var idx in arguments) {
                var val = Number(arguments[idx]);
                if (!isNaN(val)) {
                    total += val;
                }
            }
            return total;
        },
        value: function(args) {
            return args.expr; // expr already evaluated by expr()
        },
        abs: function(args) {
            return Math.abs(args.expr);
        },
        annuity: function(args) {
            var rate = args.ratePeriods.x;
            var periods = args.ratePeriods.y;
            rate = Number(rate);
            periods = Number(periods);
            if (isNaN(rate) || isNaN(periods)) {
                return null;
            }
            // also needs future rate and compounding freq ? //! fixme: need expert's check...
            return (1 / ((Math.pow(1 + rate, periods) - 1)) * rate);
        },
        atan: function(args) {
            var val = args.expr;
            val = Number(val);
            if (isNaN(val)) {
                return null;
            }
            return Math.atan(val);
        },
        average: function() {
            if (arguments.length == 0) {
                return 0;
            }
            var total = interpreterInstance.builtins.sum.apply(this, arguments);
            return total / arguments.length;
        },
        compound: function(args) {
            var rate = args.ratePeriods.x;
            var periods = args.ratePeriods.y;
            rate = Number(rate);
            periods = Number(periods);
            if (isNaN(rate) || isNaN(periods)) {
                return null;
            } //! fixme: need expert's check... is it just inverse of annuity?
            return (Math.pow(1 + rate, periods) - 1) / rate;
        },
        cos: function(args) {
            var val = Number(args.expr);
            if (isNaN(val)) {
                return null;
            }
            return Math.cos(val);
        },
        exp: function(args) {
            var val = Number(args.expr);
            if (isNaN(val)) {
                return null;
            }
            return Math.exp(val);
        },
        exp1: undefined,
        exp2: undefined,
        ln: function(args) {
            var val = Number(args.expr);
            if (isNaN(val)) {
                return null;
            }
            return Math.log(val);
        },
        ln1: undefined,
        ln2: undefined,
        log2: undefined,
        max: function() {
            var max = Number.NEGATIVE_INFINITY;
            for (var idx in arguments) {
                var val = Number(arguments[idx]);
                if (!isNaN(val)) {
                    max = (val > max) ? val : max;
                }
            }
            return max;
        },
        min: function() {
            var min = Number.POSITIVE_INFINITY;
            for (var idx in arguments) {
                var val = Number(arguments[idx]);
                if (!isNaN(val)) {
                    min = (val < min) ? val : min;
                }
            }
            return min;
        },
        round: function(args) {
            var val = Number(args.expr);
            if (isNaN(val)) {
                return null;
            }
            return Math.round(val);
        },
        sin: function(args) {
            var val = Number(args.expr);
            if (isNaN(val)) {
                return null;
            }
            return Math.sin(val);
        },
        sqrt: function(args) {
            var val = Number(args.expr);
            if (isNaN(val)) {
                return null;
            }
            return Math.sqrt(val);
        },
        tan: function(args) {
            var val = Number(args.expr);
            if (isNaN(val)) {
                return null;
            }
            return Math.tan(val);
        },
        trunc: function(args) {
            var val = Number(args.expr);
            if (isNaN(val)) {
                return null;
            }
            return Math.trunc(val);
        },
        numberOfButtons: function() {
            // get current card
            var frame = StackOp.getFrame({ frame: 'card', pointer: 'this' });
            if (frame) { // should have frame though...
                return frame.numButtons();
            }
            return 0;
        },
        numberOfFields: function() {
            // get current card
            var frame = StackOp.getFrame({ frame: 'card', pointer: 'this' });
            if (frame) { // should have frame though...
                return frame.numFields();
            }
            return 0;
        },
        numberOfButtonsIn: function(args) {
            var frame = StackOp.getFrame(args);
            if (frame) {
                return frame.numButtons();
            }
            return 0;
        },
        numberOfFieldsIn: function(args) {
            var frame = StackOp.getFrame(args);
            if (frame) {
                return frame.numFields();
            }
            return 0;
        },
        numberOfChars: function(args) {
            var text = readFromContainer(args);
            if (typeof text === 'string') {
                return text.length;
            }
            return 0;
        },
        numberOfItems: function(args) {
            var text = readFromContainer(args);
            if (typeof text === 'string') {
                return text.split(',').length;
            }
            return 0;
        },
        numberOfLines: function(args) {
            var text = readFromContainer(args);
            if (typeof text === 'string') {
                return text.split(/\r\n|\r|\n/).length;
            }
            return 0;
        },
        numberOfWords: function(args) {
            var text = readFromContainer(args);
            if (typeof text === 'string') {
                var words = text.match(/\w+/g);
                if (words) {
                    return words.length;
                } 
            }
            return 0;
        },
        numberOfBackgrounds: function() {
            // get current stack
            var frame = StackOp.getFrame({ frame: 'stack', pointer: 'this' });
            if (frame) { // should have frame though...
                return frame.numBackgrounds();
            }
            return 0;
        },
        numberOfCards: function() {
            // get current stack
            var frame = StackOp.getFrame({ frame: 'stack', pointer: 'this' });
            if (frame) { // should have frame though...
                return frame.numCards();
            }
            return 0;
        },
        numberOfCardsIn: function(args) {
            var frame = StackOp.getFrame(args);
            if (frame) { // should have frame though...
                return frame.numCards();
            }
            return 0;
        },
        numberOfMarkedCards: undefined, //! currently we aren't marking cards.
        numberOfMenus: function() { //! todo: revisit. this will return all, including hidden menu bars
            return WcMenu.numMenuBar();
        },
        numberOfMenuItems: function(args) { //! todo: revisit. this will include separators and hidden menu items
            var bar = _.has(args.menubar, 'id') ? WcMenu.getMenuBar('id', args.menubar.id) : WcMenu.getMenuBar('name', args.menubar.expr);
            if (bar) {
                console.log(bar);
                if ('menuItem' in bar) {
                    return bar.menuItem.length;
                }
            }
            return 0;
        },
        numberOfWindows: undefined,
        sound: undefined,
        tool: function() {
            return WcTool.selectedTool();
        },
        systemVersion: function() {
            return navigator.appVersion; //! todo: its too much info. need filter or better source.
        },
        version: function() { return 0.1; }, //! todo: revisit. need sync with server URI
        versionOf: function() { return 0.1; }, //! todo: revisit. need sync with server URI
        longVersion: function() { return 0.1; }, //! todo: revisit. need sync with server URI
        longVersionOf: function() { return 0.1; }, //! todo: revisit. need sync with server URI
        //! revisit menu related builtins later
        menus: undefined,
        screenRect: undefined,
        stacks: undefined, //! todo: multiple stacks not yet supported
        windows: undefined,
        diskSpace: undefined,
        heapSpace: undefined,
        stackSpace: undefined,
        selectedButtonOfBgFamily: undefined,
        selectedButtonOfCardFamily: undefined,
        programs: undefined,
        speech: undefined,
        voices: undefined,
        result: function() {
            //! todo: incorporate read, write, play, find, etc commands
            return interpreterInstance.result;
        },
        target: function() {
            var me = interpreterInstance.me; // me points to script.owner object
            var name = me.name();
            var id = me.id();
            var obj = (name === "") ? " id " + id : " " + name; // prepend space on head.
            if ('partType' in me) {
                switch(me.partType()) {
                    case WcPart.type.button: {
                        obj = " button" + obj;
                        break;
                    }
                    case WcPart.type.field: {
                        obj = " field" + obj;
                        break;
                    }
                }
                switch(me.owner().containerType()) { // part should be owned by container
                    case WcContainer.type.card: {
                        obj = "card" + obj;
                        break;
                    }
                    case WcContainer.type.bg: {
                        obj = "bg" + obj;
                        break;
                    }
                    case WcContainer.type.stack: {
                        obj = "stack" + obj;
                        break;
                    }
                }
            } else if ('containerType' in me) {
                switch(me.containerType()) {
                    case WcContainer.type.card: {
                        obj = "card" + obj;
                        break;
                    }
                    case WcContainer.type.bg: {
                        obj = "bg" + obj;
                        break;
                    }
                    case WcContainer.type.stack: {
                        obj = "stack" + obj;
                        break;
                    }
                }
            }
            return obj;
        },
        destination: undefined, //! todo: revisit when stack full path is there
        paramOf: function(args) {
            return interpreterInstance.params[parseInt(args.expr) - 1]; // index in talk starts with 1.
        },
        paramCount: function() {
            return interpreterInstance.params.length;
        },
        params: function(args) {
            var p = interpreterInstance.params.join();
            return getChunk(p, (args) ? args.chunk : undefined);
        },
        contains: function(args) {
            var offset = this.offset(args);
            if (offset == -1) {
                return false;
            } else {
                return true;
            }
        },
        isA: undefined, //! todo: not sure the usage...
        isWithin: function(args) {
            var loc;
            if ('loc' in args) {
                loc = [parseInt(args.loc.x), parseInt(args.loc.y)];
            }
            if ('expr' in args) {
                loc = args.expr.split(',').map(function(i) { return parseInt(i.trim()); });
            }
            if (loc.length !== 2 || isNaN(loc[0]) || isNaN(loc[1])) {
                return false;
            }
            var rect = args.rect.split(',').map(function(i) { return i.trim(); });
            if (rect.length !== 4 || isNaN(rect[0]) || isNaN(rect[1]) || isNaN(rect[2]) || isNaN(rect[3])) {
                return false;
            }
            // test range of x
            if (loc[0] < rect[0] || rect[2] < loc[0]) {
                return false;
            }
            // test range of y
            if (loc[1] < rect[1] || rect[3] < loc[1]) {
                return false;
            }
            return true;
        },
        concat: function(args) {
            if (args.space == true) {
                return args.str1 + ' ' + args.str2;
            } else {
                return args.str1 + '' + args.str2;
            }
        },
        thereIsA: function(args) {
            var obj = null;
            if ('part' in args.object) {
                obj = StackOp.getPart(args.object);
            } else if ('frame' in args.object) {
                obj = StackOp.getFrame(args.object);
            }
            if (typeof obj === 'object') {
                return true;
            } else {
                return false;
            }
        },
        chunkOf: function(args) {
            return getChunk(args.expr, args.chunk);
        },
    },
    loopCounter: {
        // array, for multiple hierarchial repeat loops
        counters: [], // hold current iteration value
        increment: function(inc) {
            var lastCounter = _.last(this.counters);
            lastCounter = lastCounter + inc;
            this.counters[this.counters.length - 1] = lastCounter;
        },
        push: function(init) { this.counters.push(parseInt(init)); },
        pop: function() { this.counters.pop(); },
        value: function() { return _.last(this.counters); },
    },
    eval: function(expr) {
        var val = null;
        if ('constant' in expr) {
            val = evalConstant(expr);
        }
        if ('container' in expr) {
            val = readFromContainer(expr);
        }
        if ('property' in expr) {
            val = accessProperty(expr);
        }
        return val;
    },
    call: function(funcName) {
        // check func exists in this object's handler list.
        //! todo: check if we should also look into owner's func list if not found?
        var handlers = interpreterInstance.me.script().getHandlers();
        var func = undefined;
        var args = new Array(arguments.length - 1); // chop first arg
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
        for (var idx in handlers) {
            var h = handlers[idx];
            if (h.type !== 'function') {
                continue;
            }
            if (h.name === funcName) {
                func = h.exec;
                break;
            }
        }
        if (typeof func === 'function') {
            return func.apply(this, args);
        } else {
        // if not found, look up builtin functions
            if (funcName in interpreterInstance.builtins) {
                func = interpreterInstance.builtins[funcName];
                switch (funcName) { //! todo: revisit passing style of arguments integrity.
                    case 'offset': return func({needle: args[0], haystack: args[1]});
                    case 'annuity': // fall through
                    case 'compound': return func({ratePeriods: { x: args[0], y: args[1] }});
                    case 'sum': // fall through
                    case 'average': // fall through
                    case 'max': // fall through
                    case 'min': return func.apply(this, args);
                    default: return func({ expr: args[0] }); //! fixme: need to check arg count is 1 ?
                }
            } else {
                return undefined;
            }
        }
    },
    globals: {}, // CommandTalk specific globals stored here
}

var interpreterInstance = new WcInterpreter();

window.WcInterpreter = interpreterInstance; //! fixme, hole to access from talk.js at registering global vars...

export default interpreterInstance;
