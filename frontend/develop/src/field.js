/*!
 * WebCard WcField class
 */

import WcPart from './part.js';
import WcCommon from './common.js';

/*
 * field sub class
 */
function WcField(number, partNumber, left, top, right, bottom, depth, owner) {
    WcPart.call(this, WcPart.type.field, number, partNumber, left, top, right, bottom, depth, owner);
    this.properties.style = WcField.style.scrolling;
    this.properties.autoSelect = false;
    this.properties.autoTab = false;
    this.properties.dontSearch = false;
    this.properties.dontWrap = false;
    this.properties.fixedLineHeight = true;
    this.properties.lockText = false;
    this.properties.showLines = false;
    this.properties.wideMargines = false;
    this.properties.multipleLines = false;
    this.properties.scroll = 0;
    this.properties.sharedText = true; //! todo: in bg fld, default is shared. consider not shared bg fld...
    this.properties.text = "";
}
WcField.style = {
    opaque : "Opaque",
    rectangle : "Rectangle",
    scrolling : "Scrolling",
    shadow : "Shadow",
    transparent : "Transparent"
};
WcField.prototype = Object.create(WcPart.prototype);
WcField.prototype.constructor = WcField;
WcField.prototype.buildUp = function(obj) {
    WcPart.prototype.buildUp.call(this, obj);
    // copy properties of WcField only
    for (var prop in obj.properties) {
        if (obj.properties.hasOwnProperty(prop)) {
            // set only properties of WcField
            switch(prop) {
                case 'style': // fall through
                case 'autoSelect': // fall through
                case 'autoTab': // fall through
                case 'dontSearch': // fall through
                case 'dontWrap': // fall through
                case 'fixedLineHeight': // fall through
                case 'lockText': // fall through
                case 'showLines': // fall through
                case 'wideMargines': // fall through
                case 'multipleLines': // fall through
                case 'scroll': // fall through
                case 'sharedText': // fall through
                case 'text': // fall through
                {
                    this[prop](obj.properties[prop]);
                    break;
                }
            }
        }
    }
};

WcField.prototype.style = function(val) {
    if (val) {
        var style = WcField.style;
        for (var key in style) {
            if (val === style[key]) {
                this.properties.style = style[key];
            }
        }
    }
    return this.accessProperty("style");
};
WcField.prototype.autoSelect = function(val) { return this.accessProperty("autoSelect", WcCommon.toBoolean(val)); };
WcField.prototype.autoTab = function(val) { return this.accessProperty("autoTab", WcCommon.toBoolean(val)); };
WcField.prototype.dontSearch = function(val) { return this.accessProperty("dontSearch", WcCommon.toBoolean(val)); };
WcField.prototype.dontWrap = function(val) { return this.accessProperty("dontWrap", WcCommon.toBoolean(val)); };
WcField.prototype.fixedLineHeight = function(val) { return this.accessProperty("fixedLineHeight", WcCommon.toBoolean(val)); };
WcField.prototype.lockText = function(val) { return this.accessProperty("lockText", WcCommon.toBoolean(val)); };
WcField.prototype.showLines = function(val) { return this.accessProperty("showLines", WcCommon.toBoolean(val)); };
WcField.prototype.wideMargines = function(val) { return this.accessProperty("wideMargines", WcCommon.toBoolean(val)); };
WcField.prototype.multipleLines = function(val) { return this.accessProperty("multipleLines", WcCommon.toBoolean(val)); };
WcField.prototype.scroll = function(val) { return this.accessProperty("scroll", parseInt(val)); };
WcField.prototype.sharedText = function(val) { return this.accessProperty("sharedText"); }; // read only for now
WcField.prototype.text = function(val) { return this.accessProperty("text", val); };

export default WcField;
