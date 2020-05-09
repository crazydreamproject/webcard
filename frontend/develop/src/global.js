/*!
 * WebCard global class to hold global property
 */

import WcTextAttr from './textattr.js';
import StackOp from './stack.js';
import WcCommon from './common.js';
// singleton
var globalInstance;

var cursorProperty = {
    Ibeam: "Ibeam",
    cross: "cross",
    plus: "plus",
    watch: "watch",
    hand: "hand",
    arrow: "arrow",
    busy: "busy",
    none: "none" 
};

var envProperty = {
    development: "development",
    player: "player"
}

function WcGlobal() {
    if (typeof globalInstance === 'object') {
        return globalInstance;
    }
    // setup inital global property values here
    this.blindTyping_ = false;
    this.cursor_ = cursorProperty.hand; // read only
    this.debugger_ = "ScriptEditor";
    this.dialingTime_ = 180; // 180 ticks == 3 seconds
    this.dialingVolume_ = 7; // range 0 (min) to 7 (max)
    this.dragSpeed_ = 0; // 0 means instantly move cursor to new pos. reset to 0 when idle state
    this.editBkgnd_ = false;
    this.environment_ = envProperty.development;
    this.id_ = Number.MAX_SAFE_INTEGER; //! fixme: todo: read only, value to rewrite when loaded from server.
    this.itemDelimiter_ = ','; // 1 ascii char. reset to comma when idle state
    this.language_ = "English"; // lang in scripting currently is only English. read only
    this.lockErrorDialogs_ = false; // reset to false when idle state
    this.lockMessages_ = false; // when true, dont send open/close/resume message on card move
    this.lockRecent_ = false; // reset to false when idle state
    this.lockScreen_ = false; // reset to false when idle state
    this.longWindowTitles_ = false; // show full path stack name on true
    this.messageWatcher_ = "messageWatcher";
    this.name_ = ''; // obtain current stack name from stack.js, not global.
    this.numberFormat_ = "0.#####"; // reset to this when idle state
    this.powerKeys_ = false;
    this.printMargins_ = "0,0,0,0";
    this.printTextAlign_ = "left";
    this.printTextFont_ = "Osaka";
    this.printTextHeight_ = 13; // range [0-999]
    this.printTextSize_ = 10; // range [0-999]
    this.printTextStyle_ = "plain"; //! fixme: todo: obtain fro WcTextAttr, "normal"
    this.printTextAttr = new WcTextAttr();
    this.scriptEditor_ = "ScriptEditor";
    this.scriptingLanguage_ = "CommandTalk"; // for message box. !fixme: todo: sync with WcScript.languages. maybe need setup()
    this.scriptTextFont_ = "Osaka";
    this.scriptTextSize_ = 12;
    this.scriptTextAttr = new WcTextAttr();
    this.stacksInUse_ = "";
    this.suspended_ = false;
    this.textArrows_ = false; // when true, arrowkey in fld will move Ibeam cursor, not move to next card
    this.traceDelay_ = 0;
    this.userLevel_ = 5; // range [1-5], 1: Browsing, 2: Typing, 3: Painting, 4: Authoring, 5: Scripting
    this.userModify_ = false;
    this.variableWatcher_ = "VariableWatcher";
    this.soundChannel_ = 0;

globalInstance = this;
}
WcGlobal.prototype = {
    constructor: WcGlobal,
    cursorProperty: cursorProperty,
    // environmentProperty: envProperty,

    blindTyping: function(val) {
        if (val || typeof val === 'boolean') {
            this.blindTyping_ = WcCommon.toBoolean(val);
        }
        return this.blindTyping_;
    },
    cursor: function(val) { // read only (for now)
        return this.cursor_;
    },
    debugger: function(val) {
        if (val) {
            this.debugger_ = val;
        }
        return this.debugger_;
    },
    dialingTime: function(val) {
        if (val || typeof val === 'number') {
            val = parseInt(val);
            // clip value
            if (val < 0) val = 0;
            if (val > 3600) val = 3600;
            this.dialingTime_ = val;
        }
        return this.dialingTime_;
    },
    dialingVolume: function(val) {
        if (val || typeof val === 'number') {
            val = parseInt(val);
            // clip value to range [0-7]
            if (val < 0) val = 0;
            if (val > 7) val = 7;
            this.dialingVolume_ = val;
        }
        return this.dialingVolume_;
    },
    dragSpeed: function(val) {
        if (val || typeof val === 'number') {
            val = parseInt(val);
            // clip value
            if (val < 0) val = 0;
            if (val > 1920) val = 1920;
            this.dragSpeed_ = val;
        }
        return this.dragSpeed_;
    },
    editBkgnd: function(val) {
        if (val || typeof val === 'boolean') {
            this.editBkgnd_ = WcCommon.toBoolean(val);
        }
        return this.editBkgnd_;
    },
    environment: function(val) { // read only
        return this.environment_;
    },
    id: function(val) { // read only (for now)
        return this.id_;
    },
    itemDelimiter: function(val) {
        if (val) {
            this.itemDelimiter_ = val.charCodeAt(0);
        }
        return this.itemDelimiter_;
    },
    language: function(val) { // read only (for now)
        return this.language_;
    },
    lockErrorDialogs: function(val) {
        if (val || typeof val === 'boolean') {
            this.lockErrorDialogs_ = WcCommon.toBoolean(val);
        }
        return this.lockErrorDialogs_;
    },
    lockMessages: function(val) {
        if (val || typeof val === 'boolean') {
            this.lockMessages_ = WcCommon.toBoolean(val);
        }
        return this.lockMessages_;
    },
    lockRecent: function(val) {
        if (val || typeof val === 'boolean') {
            this.lockRecent_ = WcCommon.toBoolean(val);
        }
        return this.lockRecent_;
    },
    lockScreen: function(val) {
        if (val || typeof val === 'boolean') {
            this.lockScreen_ = WcCommon.toBoolean(val);
        }
        return this.lockScreen_;
    },
    longWindowTitles: function(val) {
        if (val || typeof val === 'boolean') {
            this.longWindowTitles_ = WcCommon.toBoolean(val);
        }
        return this.longWindowTitles_;
    },
    messageWatcher: function(val) {
        if (val) {
            this.messageWatcher_ = val;
        }
        return this.messageWatcher_;
    },
    name: function(val) { // read only
        return StackOp.currentStack.name();
    },
    numberFormat: function(val) {
        if (val) {
            this.numberFormat_ = val;
        }
        return this.numberFormat_;
    },
    powerKeys: function(val) {
        if (val || typeof val === 'boolean') {
            this.powerKeys_ = WcCommon.toBoolean(val);
        }
        return this.powerKeys_;
    },
    printMargins: function(val) {
        if (val) {
            this.printMargins_ = val;
        }
        return this.printMargins_;
    },
    printTextAlign: function(val) {
        if (val) {
            this.printTextAlign_ = val;
        }
        return this.printTextAlign_;
    },
    printTextFont: function(val) {
        if (val) {
            this.printTextFont_ = val;
        }
        return this.printTextFont_;
    },
    printTextHeight: function(val) {
        if (val) {
            val = parseInt(val);
            // clip value to range [0-999]
            if (val < 0) val = 0;
            if (val > 999) val = 999;
            this.printTextHeight_ = val;
        }
        return this.printTextHeight_;
    },
    printTextSize: function(val) {
        if (val) {
            val = parseInt(val);
            // clip value to range [0-999]
            if (val < 0) val = 0;
            if (val > 999) val = 999;
            this.printTextSize_ = val;
        }
        return this.printTextSize_;
    },
    printTextStyle: function(val) {
        if (val) {
            this.printTextStyle_ = val;
        }
        return this.printTextStyle_;
    },
    scriptEditor: function(val) {
        if (val) {
            this.scriptEditor_ = val;
        }
        return this.scriptEditor_;
    },
    scriptingLanguage: function(val) {
        if (val) {
            this.scriptingLanguage_ = val;
        }
        return this.scriptingLanguage_;
    },
    scriptTextFont: function(val) {
        if (val) {
            this.scriptTextFont_ = val;
        }
        return this.scriptTextFont_;
    },
    scriptTextSize: function(val) {
        if (val) {
            val = parseInt(val);
            // clip value to range [0-999]
            if (val < 0) val = 0;
            if (val > 999) val = 999;
            this.scriptTextSize_ = val;
        }
        return this.scriptTextSize_;
    },
    stacksInUse: function(val) {
        if (val) {
            this.stacksInUse_ = val;
        }
        return this.stacksInUse_;
    },
    suspended: function(val) { // read only
        return this.suspended_;
    },
    textArrows: function(val) {
        if (val || typeof val === 'boolean') {
            this.textArrows_ = WcCommon.toBoolean(val);
        }
        return this.textArrows_;
    },
    traceDelay: function(val) {
        if (val) {
            val = parseInt(val);
            // clip value
            if (val < 0) val = 0;
            if (val > 3600) val = 3600;
            this.traceDelay_ = val;
        }
        return this.traceDelay_;
    },
    userLevel: function(val) {
        if (val) {
            val = parseInt(val);
            // clip value
            if (val < 1) val = 1;
            if (val > 5) val = 5;
            this.userLevel_ = val;
        }
        return this.userLevel_;
    },
    userModify: function(val) {
        if (val || typeof val === 'boolean') {
            this.userModify_ = WcCommon.toBoolean(val);
        }
        return this.userModify_;
    },
    variableWatcher: function(val) {
        if (val) {
            this.variableWatcher_ = val;
        }
        return this.variableWatcher_;
    },
    soundChannel: function(val) {
        if (val) {
            val = parseInt(val);
            // clip value
            if (val < 1) val = 1;
            if (val > 32) val = 32;
            this.soundChannel_ = val;
        }
        return this.soundChannel_;
    },
};

globalInstance = new WcGlobal();

export default globalInstance;
