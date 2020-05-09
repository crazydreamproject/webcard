/*!
 * WebCard event handling class
 */

import _ from 'lodash';
import WcMode from './mode.js';
import WcMenu from './menu.js';
import WcTool from './tool.js';
import WcGlobal from './global.js';
import StackOp from './stack.js';
import DomOp from './dom.js';
import WcStorage from './storage.js';
import WcParser from './talk.js';

/*
 * WebCard system message enum.
 * key is HyperTalk msg, string is web event
 */
var systemMessages = {
    mouseDown : "mousedown",
    mouseStillDown : "mousestilldown", // does not exist in web event
    mouseUp : "mouseup",
    mouseDoubleClick : "dblclick",
    mouseEnter : "mouseenter",
    mouseWithin : "mouseover",
    mouseLeave : "mouseleave",
    // missing mouse events
    // "mousemove", "auxclick" "click" "contextmenu" "wheel" "select" "pointerlockchange"
    exitField : "exitfield",
    keyDown : "keydown_wc", // modified so not to pick up native "keydown"
    commandKeyDown : "commandkeydown",
    returnKey : "returnkey",
    enterKey : "enterkey",
    tabKey : "tabkey",
    enterInField : "enterinfield",
    returnInField : "returninfield",
    arrowKey : "arrowkey",
    controlKey : "controlkey",
    functionKey : "functionkey",
    // missing key events
    // "keyup" "keypress"
    doMenu : "domenu",
    suspendStack : "suspendstack",
    resumeStack : "resumestack",
    startUp : "startup",
    suspend : "suspend",
    resume : "resume",
    quit : "quit",
    appleEvent : "appleevent",
    help : "help",
    close : "close",
    sizeWindow : "sizewindow",
    moveWindow : "movewindow",
    mouseDownInPicture : "mousedowninpicture",
    mouseUpInPicture : "mouseupinpicture",
    openPicture : "openpicture",
    openPalette : "openpalette",
    closePicture : "closepicture",
    closePalette : "closepalette",
    choose : "choose",
    closeCard : "closecard",
    closeField : "closefield",
    closeBackground : "closebackground",
    closeStack : "closeStack",
    deleteBackground : "deletebackground",
    deleteButton : "deletebutton",
    deleteCard : "deletecard",
    deleteField : "deletefield",
    deleteStack : "deletestack",
    idle : "idle",
    newBackground : "newbackground",
    newButton : "newbutton",
    newCard : "newcard",
    newField : "newfield",
    newStack : "newstack",
    openBackground : "openbackground",
    openCard : "opencard",
    openField : "openfield",
    openStack : "openstack",
};

//! todo: wrap these static vars into one object...
var scriptState = {
    idle: 'No talk script is running',
    running: 'some talk script is running'
};
var state = scriptState.idle;
var emergencyStop = false;
var isKeyDown = {
    commandKey: false,
    controlKey: false,
    shiftKey: false,
    optionKey: false,
};
var mouseState = 'down';
var mouseClick = {
    clicked: false,
    clickH: 0,
    clickV: 0
};

var idleTimer;
function fireIdle() {
    if (state === scriptState.idle
        && WcMode.getMode() === WcMode.modes.browse
        && emergencyStop === false) {
        // fire idle event
        $(cardFrameId).trigger(systemMessages.idle);
    }
    requestAnimationFrame(fireIdle);
}

var mouseX = 0;
var mouseY = 0;

function setupToplevelHandlers() {
    $(document)
    // enable mouse event bubble up propagation for modal items
    .on(systemMessages.mouseDown, function(){})
    .on(systemMessages.mouseStillDown, function(){})
    .on(systemMessages.mouseUp, function(){})
    .on(systemMessages.mouseDoubleClick, function(){})
    .on(systemMessages.mouseEnter, function(){})
    .on(systemMessages.mouseWithin, function(){})
    .on(systemMessages.mouseLeave, function(){})
    // key related global top handlers
    .on(systemMessages.arrowKey, function(ev, arrow) {
        if (WcGlobal.textArrows()) {
            return false; // dont move cards if global textArrows property is set
        }
        arrow = arrow.toLowerCase();
        switch(arrow) {
            case 'left': WcMenu.getMenuItem('name', 'Prev').callback(); break;
            case 'right': WcMenu.getMenuItem('name', 'Next').callback(); break;
            case 'up':
            case 'down':
                break;
            }
        return false;
    })
    .on(systemMessages.commandKeyDown, false)
    .on(systemMessages.returnKey, false)
    .on(systemMessages.enterKey, false)
    .on(systemMessages.tabKey, false)
    // handle menu shortcuts
    .on(systemMessages.controlKey, function(ev, key) {
        switch (key) {
            // File menu
            case 'o': WcMenu.getMenuItem('name', 'Open Stack...').callback(); break;
            case 'w': WcMenu.getMenuItem('name', 'Close Stack').callback(); break;
            case 'p': WcMenu.getMenuItem('name', 'Print Card').callback(); break;
            case 'q': WcMenu.getMenuItem('name', 'Quit').callback(); break;
            // Edit menu
            case 'z': WcMenu.getMenuItem('name', 'Undo').callback(); break;
            case 'x': WcMenu.getMenuItem('name', 'Cut').callback(); break;
            case 'c': WcMenu.getMenuItem('name', 'Copy').callback(); break;
            case 'v': WcMenu.getMenuItem('name', 'Paste Card').callback(); break;
            case 'n': WcMenu.getMenuItem('name', 'New Card').callback(); break;
            case 't': WcMenu.getMenuItem('name', 'Text Style').callback(); break;
            case 'b': WcMenu.getMenuItem('name', 'Background').callback(); break;
            case 'i': WcMenu.getMenuItem('name', 'Icon...').callback(); break;
            // Go menu
            case '~': WcMenu.getMenuItem('name', 'Back').callback(); break;
            case 'h': WcMenu.getMenuItem('name', 'Home').callback(); break;
            case '?': WcMenu.getMenuItem('name', 'Help').callback(); break;
            case 'r': WcMenu.getMenuItem('name', 'Recent').callback(); break;
            case '1': WcMenu.getMenuItem('name', 'First').callback(); break;
            case '2': WcMenu.getMenuItem('name', 'Prev').callback(); break;
            case '3': WcMenu.getMenuItem('name', 'Next').callback(); break;
            case '4': WcMenu.getMenuItem('name', 'Last').callback(); break;
            case 'f': WcMenu.getMenuItem('name', 'Find...').callback(); break;
            case 'm': WcMenu.getMenuItem('name', 'Message').callback(); break;
            //case 'z': WcMenu.getMenuItem('name', 'Scroll').callback(); break; // overlaps with Undo...
            case 'l': WcMenu.getMenuItem('name', 'Next Window').callback(); break;
            // Objects menu
            case '+': WcMenu.getMenuItem('name', 'Bring Closer').callback(); break;
            case '-': WcMenu.getMenuItem('name', 'Bring Farther').callback(); break;
            // Paint menu
            //! todo do this only when visible in menu...
            case 's': WcMenu.getMenuItem('name', 'Select').callback(); break;
            case 'a': WcMenu.getMenuItem('name', 'Select All...').callback(); break;
            case 'k': WcMenu.getMenuItem('name', 'Keep').callback(); break;
            // debug menu
            case 's': WcMenu.getMenuItem('name', 'Step').callback(); break; // overlap...
            case 's': WcMenu.getMenuItem('name', 'Step Into').callback(); break; // overlap...
            case 't': WcMenu.getMenuItem('name', 'Trace Into').callback(); break; // overlap...
            case 'd': WcMenu.getMenuItem('name', 'Set Checkpoint').callback(); break;
            case 'a': WcMenu.getMenuItem('name', 'Abort').callback(); break; // overlap...
            // emergency stop
            case '.': {
                emergencyStop = true; // flag stop
                WcMode.setMode(WcMode.modes.edit); // change so script will not execute
                break;
            }
        }
        return false;
    })
    .on(systemMessages.functionKey, false)
    //! todo: others to come below
    .on(systemMessages.exitField, false)
    .on(systemMessages.doMenu, false)
    .on(systemMessages.suspendStack, false)
    .on(systemMessages.resumeStack, false)
    .on(systemMessages.startUp, false)
    .on(systemMessages.suspend, false)
    .on(systemMessages.resume, false)
    .on(systemMessages.quit, false)
    .on(systemMessages.appleEvent, false)
    .on(systemMessages.help, function(){
        // !todo: Open WebCard Help stack when it is available
        alert("WebCard Help stack not ready...");
        return false;
    })
    .on(systemMessages.close, false)
    .on(systemMessages.sizeWindow, false)
    .on(systemMessages.moveWindow, false)
    .on(systemMessages.mouseDownInPicture, false)
    .on(systemMessages.mouseUpInPicture, false)
    .on(systemMessages.openPicture, false)
    .on(systemMessages.openPalette, false)
    .on(systemMessages.closePicture, false)
    .on(systemMessages.closePalette, false)
    .on(systemMessages.choose, function(ev, name, number) {
        WcTool.clickTool("#" + name + '_Tool');
        return false;
    })
    .on(systemMessages.closeCard, false)
    .on(systemMessages.closeField, false)
    .on(systemMessages.closeBackground, false)
    .on(systemMessages.closeStack, false)
    .on(systemMessages.deleteBackground, false)
    .on(systemMessages.deleteButton, false)
    .on(systemMessages.deleteCard, false)
    .on(systemMessages.deleteField, false)
    .on(systemMessages.deleteStack, false)
    .on(systemMessages.idle, false)
    .on(systemMessages.newBackground, false)
    .on(systemMessages.newButton, false)
    .on(systemMessages.newCard, false)
    .on(systemMessages.newField, false)
    .on(systemMessages.newStack, false)
    .on(systemMessages.openBackground, false)
    .on(systemMessages.openCard, false)
    .on(systemMessages.openField, false)
    .on(systemMessages.openStack, false)
    ;
}


var cardFrameId;
// singleton class of event
var eventInstance;
function WcEvent() {
    if (typeof eventInstance === 'object') {
        return eventInstance;
    }
    eventInstance = this;
}
WcEvent.getInstance = function() { return new WcEvent(); };
WcEvent.systemMessages = systemMessages;
WcEvent.prototype = {
    constructor: WcEvent,
    setup: function(frameId) {
        cardFrameId = frameId;
        setupToplevelHandlers();
        // convert web events to wc msg
        $(document)
            .on({'keydown': function(ev) {
                isKeyDown.controlKey = ev.ctrlKey;
                isKeyDown.shiftKey = ev.shiftKey;
                isKeyDown.commandKey = ev.altKey; //! todo: revisit this key binding
                isKeyDown.optionKey = ev.metaKey; //! todo: revisit this key bindingaa
                if (ev.ctrlKey && ev.shiftKey && ev.key !== 'Control' && ev.key !== 'Shift') {
                    // handle keys like +,~,?, where shift is needed. ev.key is undefined ...
                    switch(ev.which) {
                        case 187: $(cardFrameId).trigger(systemMessages.controlKey, '+'); return false;
                        case 191: $(cardFrameId).trigger(systemMessages.controlKey, '?'); return false;
                        case 222: $(cardFrameId).trigger(systemMessages.controlKey, '~'); return false;
                    }
                    // e.g. 'ctrl + shift + c' -> open card script shortcuts
                    switch(ev.key.toLowerCase()) {
                        case 'c': StackOp.currentCard().script().edit(); return false;
                        case 'b': StackOp.currentBg().script().edit(); return false;
                        case 's': StackOp.currentStack.script().edit(); return false;
                    }
                    return false;
                }
                if (ev.ctrlKey && ev.key !== 'Control') {
                    switch(ev.which) {
                        case 187: $(cardFrameId).trigger(systemMessages.controlKey, '-'); return false;
                        case 190: $(cardFrameId).trigger(systemMessages.controlKey, '.'); return false;
                    }
                    $(cardFrameId).trigger(systemMessages.controlKey, ev.key);
                    return false;
                }
                switch(ev.which) {
                    case 9: // Tab
                        $(cardFrameId).trigger(systemMessages.tabKey); return true;
                    case 13: // Enter
                        $(cardFrameId).trigger(systemMessages.enterKey); return true; // return false will disable field input enter...
                    // arrow keys
                    case 37: // left
                    case 38: // up
                    case 39: // right
                    case 40: // down
                        $(cardFrameId).trigger(systemMessages.arrowKey, ev.key.replace('Arrow',''));
                        return false;
                }
                $(cardFrameId).trigger(systemMessages.keyDown, ev.key);
                //return false;
                return true; // bubble up (or else F12 debug is not triggered)
            },
            'keyup': function(ev) {
                isKeyDown.controlKey = ev.ctrlKey;
                isKeyDown.shiftKey = ev.shiftKey;
                isKeyDown.commandKey = ev.altKey; //! todo: revisit this key binding
                isKeyDown.optionKey = ev.metaKey; //! todo: revisit this key bindingaa
            },

            'mousemove': function(ev) {
                mouseX = ev.pageX;
                mouseY = ev.pageY;
                if (mouseClick.clicked) { //! todo: revisit. not really good place to reset click event...
                    mouseClick.clicked = false;
                    mouseClick.clickH = mouseClick.clickV = 0;
                }
            },
            'mousedown': function(ev) {
                mouseState = 'down';
            },
            'mouseup': function(ev) {
                mouseState = 'up';
                mouseClick.clicked = true;
                mouseClick.clickV = ev.pageX;
                mouseClick.clickH = ev.pageY;
            },
            //! fixme: click event fires only at double click. single mouse click does not fire...
            'click': function(ev) {
                /*
                console.log("mouse clicked");
                mouseClick.clicked = true;
                mouseClick.clickV = ev.pageX;
                mouseClick.clickH = ev.pageY;
                */
            }
        });
        requestAnimationFrame(fireIdle); // start animation frame on idle
        // reset emergencyStop when switched to browse mode
        WcMode.register(WcMode.modes.browse, function() {
            emergencyStop = false;
        });
    },
    fire: function(msg, param) {
        $(cardFrameId).trigger(msg, param);
    },
    setState: function(s) {
        switch(s) {
            case scriptState.idle:
                // reset properties
                WcInterpreter.commands.unlockRecent();
                // DomOp.unlockScreen(); // reconsider
                /* fall through */
            case scriptState.running:
                state = s;
                break;
            default:
                console.error("No such state: "+ s);
        }
    },
    checkEmergency: function() {
        return emergencyStop;
    },
    mouseX: function() {
        // adjust offset
        return parseInt(mouseX - $(cardFrameId).offset().left);
    },
    mouseY: function() {
        // adjust offset
        return parseInt(mouseY - $(cardFrameId).offset().top);
    },    
    commandKey: function() {
        return isKeyDown.commandKey;
    },
    controlKey: function() {
        return isKeyDown.controlKey;
    },
    shiftKey: function() {
        return isKeyDown.shiftKey;
    },
    optionKey: function() {
        return isKeyDown.optionKey;
    },
    mouse: function() {
        return mouseState;
    },
    mouseClick: function() {
        return mouseClick.clicked;
    },
    clickH: function() {
        // adjust offset
        return parseInt(mouseClick.clickH - $(cardFrameId).offset().top);
    },
    clickV: function() {
        // adjust offset
        return parseInt(mouseClick.clickV - $(cardFrameId).offset().left);
    },
    message: {
        wnd: null,
        open: function() {
            var callback = function(ev) {
                var msgKey = WcStorage.keys.msg;
                var oldVal = ev.oldValue;
                // append dummy function name entry to make it a valid script
                var newVal = 'function f\n' + ev.newValue + '\nend f';
                var sArea = ev.storageArea;
                var key = ev.key;
                var url = ev.url;
                if (key === msgKey) {
                    var result = WcParser.parser.parse(newVal);
                    if ($.isArray(result)) {
                        // run one liner script immediately
                        result[0].exec();
                    } else {
                        // or is alert better ? -> error shown in msgbox itself
                        //WcStorage.local.save(msgKey, result.text.replace(/ line:.*,/, ''));
                        //alert(result.text.replace(/ line:.*,/, ''));
                    }
                }
            };
            var idx = WcStorage.local.register(callback);
            this.wnd = window.open('msgbox.html', null, 'top=100, left=100, width=640, height=200, menubar=no, toolbar=no, location=no, status=no, resizable=yes, scrollbars=no');
            this.wnd.idx = idx;
            /*
            //! fixme find a better way to detect child window closed
            var that = this;
            var timer = setInterval(function() {
                if (that.wnd.closed) {
                    that.close();
                    clearInterval(timer);
                }
            }, 1000);
            */
        },
        close: function() {
            if (this.wnd) {
                WcStorage.local.unregister(this.wnd.idx);
                WcStorage.local.remove(WcStorage.keys.msg);
                this.wnd.close();
                this.wnd = null;
            }
        },
        closed: function() {
            if (this.wnd) {
                if (this.wnd.closed) {
                    this.close();
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        write: function(str) {
            WcStorage.local.save(WcStorage.keys.msg, str);
            if (!this.wnd) {
                this.open();
            }
        },
        read: function() {
            return WcStorage.local.load(WcStorage.keys.msg);
        }
    },
    scriptState: scriptState,
    systemMessages: systemMessages
};

eventInstance = new WcEvent();

export default eventInstance;
